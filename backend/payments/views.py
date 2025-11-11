from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import JsonResponse
import json

from core.models import Payment, Order
from .mpesa import lipa_na_mpesa
from .notifications import send_payment_completed_email


@csrf_exempt
def initiate_payment(request, order_id):
    """
    Trigger STK Push for an order
    """
    try:
        order = Order.objects.get(id=order_id)
        # Replace with the buyer's phone number or a specific number
        response = lipa_na_mpesa(order.buyer.phone, order.total_amount, order)
        return JsonResponse(response)
    except Order.DoesNotExist:
        return JsonResponse({"error": "Order not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def mpesa_callback(request):
    """Handle MPESA STK Push callback"""
    data = json.loads(request.body.decode("utf-8"))
    print("Callback Data:", data)  # Optional debug

    try:
        body = data['Body']['stkCallback']
        checkout_id = body['CheckoutRequestID']
        result_code = body['ResultCode']

        payment = Payment.objects.filter(transaction__reference=checkout_id).first()

        if payment:
            if result_code == 0:
                # Successful transaction
                items = body.get("CallbackMetadata", {}).get("Item", [])
                mpesa_receipt = None
                for item in items:
                    if item.get("Name") == "MpesaReceiptNumber":
                        mpesa_receipt = item.get("Value")
                        break

                payment.status = "completed"
                payment.mpesa_receipt_number = mpesa_receipt
                payment.order.status = "completed"
                payment.order.save()
                payment.save()

                # Send Email notification to buyer
                send_payment_completed_email(
                    user_email=payment.order.buyer.email,
                    order_id=payment.order.id,
                    amount=payment.order.total_amount
                )
            else:
                payment.status = "failed"
                payment.save()

    except KeyError:
        pass

    return JsonResponse({"status": "success"})


@csrf_exempt
@require_POST
def verify_payment(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
        receipt_number = data.get("mpesa_receipt_number")

        if not receipt_number:
            return JsonResponse({"success": False, "message": "Please provide a transaction code."}, status=400)

        payment = Payment.objects.filter(mpesa_receipt_number=receipt_number).first()

        if payment:
            if payment.status != "completed":
                payment.status = "completed"
                payment.order.status = "completed"
                payment.order.save()
                payment.save()

            # Send email notification if payment was just verified
            send_payment_completed_email(
                user_email=payment.order.buyer.email,
                order_id=payment.order.id,
                amount=payment.order.total_amount
            )

            return JsonResponse({
                "success": True,
                "message": "Payment verified successfully.",
                "order_id": payment.order.id
            })
        else:
            return JsonResponse({"success": False, "message": "Transaction code not found."}, status=404)

    except Exception as e:
        return JsonResponse({"success": False, "message": f"Error verifying payment: {str(e)}"}, status=500)
