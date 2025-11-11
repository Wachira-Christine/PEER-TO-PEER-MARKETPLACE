from django.core.mail import send_mail
from django.conf import settings

def send_payment_completed_email(user_email, order_id, amount):
    subject = f"Payment Completed for Order #{order_id}"
    message = f"""
Hello!

Your payment of KES {amount} for Order #{order_id} has been successfully received.

Thank you for shopping with us!
"""
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user_email], fail_silently=False)

def send_order_cancelled_email(user_email, order_id):
    subject = f"Order #{order_id} Cancelled"
    message = f"""
Hello!

Your order #{order_id} has been cancelled successfully.

If you made a payment, it will be refunded shortly.
"""
    send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user_email], fail_silently=False)
