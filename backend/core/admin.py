from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Listing, Product, Order, OrderItem, Transaction, Payment, Review
from payments.mpesa import lipa_na_mpesa  
from payments.notifications import send_order_cancelled_email



# Custom User Admin

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = (
        "username",
        "email",
        "phone",
        "role",
        "is_staff",
        "is_active",
        "date_joined",
        "last_login"
    )
    search_fields = ("username", "email", "phone")
    list_filter = ("role", "is_staff", "is_active")
    ordering = ("username",)
    readonly_fields = ("date_joined", "last_login")

    fieldsets = (
        (None, {"fields": ("username", "email", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name", "phone", "role")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"fields": ("last_login", "date_joined")}),
    )



# Listing Admin

@admin.register(Listing)
class ListingAdmin(admin.ModelAdmin):
    list_display = ("title", "seller", "created_at")
    search_fields = ("title", "seller__username")
    list_filter = ("created_at",)


# Product Admin

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["get_listing_title", "price", "stock", "created_at"]

    def get_listing_title(self, obj):
        return obj.listing.title
    get_listing_title.short_description = "Listing"



# Order and OrderItem Admin

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 1


@admin.action(description="Cancel selected orders (with refund)")
def cancel_orders(modeladmin, request, queryset):
    for order in queryset:
        order.status = "cancelled"
        order.save()
        send_order_cancelled_email(order.buyer.email, order.id)
        modeladmin.message_user(
            request,
            f"Order #{order.id} cancelled and email sent to user."
        )

@admin.action(description="Send STK Push for selected orders")
def send_stk_push(modeladmin, request, queryset):
    for order in queryset:
        payment = getattr(order, "payment", None)
        if not payment:
            modeladmin.message_user(request, f"Order #{order.id} has no payment object.", level="error")
            continue
        if payment.status == "completed":
            modeladmin.message_user(request, f"Order #{order.id} already paid.")
            continue
        # Trigger STK Push
        response = lipa_na_mpesa(order)
        modeladmin.message_user(request, f"STK Push triggered for Order #{order.id}: {response}")


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ("id", "buyer", "status", "get_mpesa_code", "created_at")
    search_fields = ("buyer__username", "payment__mpesa_receipt_number")
    list_filter = ("status", "created_at")  # Only fields here
    inlines = [OrderItemInline]
    actions = [cancel_orders, send_stk_push]

    def get_mpesa_code(self, obj):
        payment = Payment.objects.filter(order=obj).first()
        return payment.mpesa_receipt_number if payment else "-"
    get_mpesa_code.short_description = "M-PESA Code"


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = ("order", "product", "quantity", "price")



# Transaction Admin

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("user", "amount", "transaction_type", "status", "reference", "timestamp")
    list_filter = ("transaction_type", "status", "timestamp")
    search_fields = ("user__username", "reference")



# Payment Admin

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ("order", "method", "status", "mpesa_receipt_number", "created_at")
    list_filter = ("method", "status", "created_at")
    search_fields = ("mpesa_receipt_number", "order__id")



# Review Admin

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ("product", "reviewer", "rating", "created_at")
    search_fields = ("product__title", "reviewer__username")
    list_filter = ("rating", "created_at")
