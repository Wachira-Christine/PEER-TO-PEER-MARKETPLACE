from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings


# Custom User

class User(AbstractUser):
    phone = models.CharField(max_length=15, blank=True, null=True)
    role = models.CharField(
        max_length=20,
        choices=[("buyer", "Buyer"), ("seller", "Seller"), ("admin", "Admin")],
        default="buyer",
    )

    def __str__(self):
        return self.username



# Listings & Products

class Listing(models.Model):
    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listings")
    title = models.CharField(max_length=255)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class Product(models.Model):
    listing = models.ForeignKey(
        "Listing", on_delete=models.CASCADE, related_name="products"
    )
    price = models.DecimalField(max_digits=10, decimal_places=2)
    stock = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
     
        return f"{self.listing.title} ({self.stock} left)"




# Orders

class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    buyer = models.ForeignKey(User, on_delete=models.CASCADE)
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, default="pending")
    created_at = models.DateTimeField(auto_now_add=True)

    def calculate_total(self):
        if self.pk:
            return sum(item.get_total() for item in self.items.all())
        return 0

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        total = self.calculate_total()
        if self.total_amount != total:
            self.total_amount = total
            super().save(update_fields=["total_amount"])

    def __str__(self):
        return f"Order #{self.id} - {self.buyer.username} - {self.status}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def get_total(self):
        return self.price * self.quantity

    def __str__(self):
          return f"{self.product.listing.title} x {self.quantity}"



# Transactions & Payments

class Transaction(models.Model):
    TRANSACTION_TYPES = [
        ('purchase', 'Purchase'),
        ('payment', 'Payment Received'),
        ('refund', 'Refund'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, default=1)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    transaction_type = models.CharField(max_length=20, choices=TRANSACTION_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    reference = models.CharField(max_length=100, blank=True, null=True)  # external ref (e.g., M-Pesa)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-timestamp']

    def __str__(self):
        return f"{self.user.username} - {self.transaction_type} - {self.amount}"


class Payment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
    ]
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name="payment")
    transaction = models.OneToOneField(Transaction, on_delete=models.CASCADE, related_name="payment", null=True, blank=True)
    method = models.CharField(
        max_length=20,
        choices=[("mpesa", "M-Pesa"), ("card", "Card")],  # removed wallet
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    mpesa_receipt_number = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Payment for Order #{self.order.id}"



# Reviews

class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    reviewer = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    rating = models.PositiveSmallIntegerField()
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.rating}/5 by {self.reviewer.username}"
