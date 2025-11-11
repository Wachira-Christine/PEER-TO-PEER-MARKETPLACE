import requests
import base64
from datetime import datetime
from decouple import config
from core.models import Order, Payment, Transaction

# CONFIGURATION

CONSUMER_KEY = config("MPESA_CONSUMER_KEY")
CONSUMER_SECRET = config("MPESA_CONSUMER_SECRET")
SHORTCODE = config("MPESA_SHORTCODE")
PASSKEY = config("MPESA_PASSKEY")
ENVIRONMENT = config("MPESA_ENVIRONMENT", default="sandbox")

if ENVIRONMENT == "sandbox":
    OAUTH_URL = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    STK_PUSH_URL = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
else:
    OAUTH_URL = "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    STK_PUSH_URL = "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest"



# ACCESS TOKEN FUNCTION

def get_access_token():
    response = requests.get(OAUTH_URL, auth=(CONSUMER_KEY, CONSUMER_SECRET))
    response.raise_for_status()
    return response.json().get("access_token")



# LIPA NA MPESA FUNCTION

def lipa_na_mpesa(order: Order):
    """Trigger STK Push for an order"""

    # Ensure order has buyer and phone
    if not order.buyer or not order.buyer.phone:
        raise ValueError("Buyer must have a valid phone number for MPESA.")

    # Generate password and timestamp
    access_token = get_access_token()
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    password = base64.b64encode((SHORTCODE + PASSKEY + timestamp).encode()).decode()

    # Headers for the API request
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
    }

    # Payload for STK Push request
    payload = {
        "BusinessShortCode": SHORTCODE,
        "Password": password,
        "Timestamp": timestamp,
        "TransactionType": "CustomerPayBillOnline",
        "Amount": int(order.total_amount),
        "PartyA": "254758743522",  
        "PartyB": SHORTCODE,
        "PhoneNumber": "254758743522", 
        "CallBackURL": "https://zanies-overindulgently-brain.ngrok-free.dev/payments/callback/",
        "AccountReference": f"Order{order.id}",
        "TransactionDesc": f"Payment for Order {order.id}",
    }

    # Send STK push request
    response = requests.post(STK_PUSH_URL, json=payload, headers=headers).json()

    # Log or print for debugging
    print("STK Push Response:", response)

    # Save payment & transaction
    payment, _ = Payment.objects.get_or_create(
        order=order, defaults={"method": "mpesa", "status": "pending"}
    )

    checkout_id = response.get("CheckoutRequestID")
    if checkout_id:
        txn = Transaction.objects.create(
            user=order.buyer,
            amount=order.total_amount,
            transaction_type="purchase",
            status="pending",
            reference=checkout_id,
        )
        payment.transaction = txn
        payment.save()

    return response
