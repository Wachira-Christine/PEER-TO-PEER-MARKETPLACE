from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from core.views import (
    ProductViewSet,
    ListingViewSet,
    OrderViewSet,
    TransactionViewSet,
)

# DRF Router
router = DefaultRouter()
router.register("products", ProductViewSet, basename="product")
router.register("listings", ListingViewSet, basename="listing")
router.register("orders", OrderViewSet, basename="order")
router.register("transactions", TransactionViewSet, basename="transaction")

urlpatterns = [
    path("admin/", admin.site.urls),

    # DRF API routes
    path("api/", include(router.urls)),

    # JWT auth endpoints
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),

    # Payments app URLs
    path("payments/", include("payments.urls")),  # verify_payment is here already
]
