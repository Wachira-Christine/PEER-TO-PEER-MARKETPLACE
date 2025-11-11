from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver
from .models import User, Order, OrderItem, Transaction, Payment


# Deduct stock on order item creation

@receiver(pre_save, sender=OrderItem)
def deduct_stock(sender, instance, **kwargs):
    if instance.pk is None:  # New item
        product = instance.product
        if product.stock < instance.quantity:
            raise ValueError("Not enough stock available!")
        product.stock -= instance.quantity
        product.save()


# Recalculate Order total on OrderItem create/update

@receiver(post_save, sender=OrderItem)
def update_order_total(sender, instance, **kwargs):
    order = instance.order
    total = sum(item.get_total() for item in order.items.all())
    if order.total_amount != total:
        order.total_amount = total
        order.save(update_fields=["total_amount"])



# Auto-create a pending payment when order is created

@receiver(post_save, sender=Order)
def create_order_payment(sender, instance, created, **kwargs):
    if created:
        Payment.objects.create(order=instance, method="mpesa", status="pending")



# Process completed payments

@receiver(post_save, sender=Payment)
def process_payment(sender, instance, **kwargs):
    if instance.status != "completed" or instance.transaction:
        return

    order = instance.order
    total_amount = sum(item.price * item.quantity for item in order.items.all())

    # Create a transaction record for the payment received
    txn = Transaction.objects.create(
        user=order.buyer,
        transaction_type="payment",
        amount=total_amount,
        reference=instance.transaction.reference if instance.transaction else None,
        status="completed"
    )
    instance.transaction = txn
    instance.save(update_fields=["transaction"])

    # Mark order as completed
    order.status = "completed"
    order.save(update_fields=["status"])



# Handle refunds when order is cancelled

@receiver(post_save, sender=Order)
def refund_on_cancel(sender, instance, **kwargs):
    if instance.status != "cancelled":
        return

    payment = Payment.objects.filter(order=instance, status="completed").first()
    if not payment or not payment.transaction:
        return

    refund_amount = sum(item.price * item.quantity for item in instance.items.all())

    # Record refund transaction
    Transaction.objects.create(
        user=instance.buyer,
        transaction_type="refund",
        amount=refund_amount,
        reference=payment.transaction.reference if payment.transaction else None,
        status="completed"
    )

    # Update payment status
    payment.status = "refunded"
    payment.save(update_fields=["status"])

    # Restore stock
    for item in instance.items.all():
        product = item.product
        product.stock += item.quantity
        product.save()
