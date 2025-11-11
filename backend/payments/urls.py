from django.urls import path
from . import views

urlpatterns = [
    path("pay/<int:order_id>/", views.initiate_payment, name="initiate_payment"),
    path("callback/", views.mpesa_callback, name="mpesa_callback"),
    path("verify/", views.verify_payment, name="verify_payment"),
]
