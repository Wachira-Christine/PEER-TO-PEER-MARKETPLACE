from django.db.models.signals import post_save
from django.dispatch import receiver
from core.models import Order
from .mpesa import lipa_na_mpesa

@receiver(post_save, sender=Order)
def trigger_stk_push(sender, instance, created, **kwargs):
    """
    Automatically send STK Push for orders with pending MPESA payments.
    """
    # Skip new orders; Payment will be created by core.signals
    if created:
        return

    payment = getattr(instance, "payment", None)
    if not payment:
        return

    if payment.status == "pending" and payment.method == "mpesa":
        try:
            lipa_na_mpesa(instance)
        except Exception as e:
            # Optional: log errors
            print(f"Error triggering STK Push for Order {instance.id}: {e}")
