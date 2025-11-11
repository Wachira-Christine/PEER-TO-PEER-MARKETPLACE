from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.http import JsonResponse
import json

from .models import Product, Listing, Order, Transaction, Payment
from .serializers import (
    ProductSerializer,
    ListingSerializer,
    OrderSerializer,
    TransactionSerializer,
    PaymentSerializer,
)

# Product & Listing APIs

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.AllowAny]


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = [permissions.AllowAny]



# Order APIs

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Order.objects.all()

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        order = self.get_object()
        if order.status not in ["pending", "processing"]:
            return Response(
                {"error": "Only pending or processing orders can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST,
            )
        order.status = "cancelled"
        order.save()
        return Response({"status": "Order cancelled successfully."})

    @action(detail=True, methods=["post"])
    def complete(self, request, pk=None):
        """
        Mark an order as completed manually (external payment).
        """
        order = self.get_object()
        if order.status != "pending":
            return Response(
                {"error": "Only pending orders can be completed."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        payment, _ = Payment.objects.get_or_create(
            order=order, defaults={"method": "mpesa", "status": "completed"}
        )

        Transaction.objects.create(
            user=order.buyer if order.buyer else None,
            amount=order.total_amount,
            transaction_type="payment",
            status="completed",
            reference=f"MPESA-{order.id}",
        )

        order.status = "completed"
        order.save()
        payment.status = "completed"
        payment.save()

        return Response({
            "status": "Order marked as completed with external payment",
            "order_id": order.id,
            "amount": order.total_amount
        })



# Transaction APIs

class TransactionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Transaction.objects.all().order_by("-timestamp")
    serializer_class = TransactionSerializer
    permission_classes = [permissions.AllowAny]



# Payment APIs

class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Payment.objects.all().order_by("-created_at")
    serializer_class = PaymentSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=["post"])
    @csrf_exempt
    def verify(self, request):
        """
        Verify a payment by M-PESA transaction code via DRF.
        POST JSON: { "mpesa_receipt_number": "QF23KJ7X2C" }
        """
        try:
            data = json.loads(request.body.decode("utf-8"))
            code = data.get("mpesa_receipt_number")
            if not code:
                return Response(
                    {"success": False, "message": "Please provide a transaction code."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            payment = Payment.objects.filter(mpesa_receipt_number=code).first()
            if payment:
                if payment.status != "completed":
                    payment.status = "completed"
                    payment.order.status = "completed"
                    payment.order.save()
                    payment.save()
                return Response({"success": True, "message": "Payment verified successfully."})
            else:
                return Response(
                    {"success": False, "message": "Transaction code not found."},
                    status=status.HTTP_404_NOT_FOUND,
                )
        except Exception as e:
            return Response(
                {"success": False, "message": f"Error verifying payment: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )



# Step 3: Traditional Django view for verification

@csrf_exempt
@require_POST
def verify_payment(request):
    """
    Verify a payment by M-PESA transaction code via standard Django view.
    POST JSON: { "mpesa_receipt_number": "QF23KJ7X2C" }
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
        code = data.get("mpesa_receipt_number")

        if not code:
            return JsonResponse({"success": False, "message": "Please provide a transaction code."})

        payment = Payment.objects.filter(mpesa_receipt_number=code).first()
        if payment:
            if payment.status != "completed":
                payment.status = "completed"
                payment.order.status = "completed"
                payment.order.save()
                payment.save()
            return JsonResponse({"success": True, "message": "Payment verified successfully."})
        else:
            return JsonResponse({"success": False, "message": "Transaction code not found."})
    except Exception as e:
        return JsonResponse({"success": False, "message": f"Error verifying payment: {str(e)}"})
