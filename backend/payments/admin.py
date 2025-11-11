from django.contrib import admin
from core.models import Order
from .mpesa import lipa_na_mpesa

@admin.action(description="Send STK Push for selected orders")
def send_stk_push(modeladmin, request, queryset):
    for order in queryset:
        payment = getattr(order, "payment", None)
        if payment and payment.status == "completed":
            modeladmin.message_user(request, f"Order {order.id} already paid.")
            continue
        response = lipa_na_mpesa(order)
        modeladmin.message_user(request, f"STK Push triggered for Order {order.id}: {response}")

#@admin.register(Order)
#class OrderAdmin(admin.ModelAdmin):
 #   list_display = ["id", "buyer", "total_amount", "status"]
  #  actions = [send_stk_push]
