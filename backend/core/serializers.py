from rest_framework import serializers
from .models import Transaction, Product, Listing, Order, OrderItem, Payment


# Transaction

class TransactionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Transaction
        fields = ["id", "user", "amount", "transaction_type", "status", "reference", "timestamp"]



# Product & Listing

class ProductSerializer(serializers.ModelSerializer):
    listing_title = serializers.CharField(source='listing.title', read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'listing_title', 'price', 'stock', 'created_at']


class ListingSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)

    class Meta:
        model = Listing
        fields = ["id", "seller", "title", "description", "created_at", "products"]



# Order & Order Items

class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.listing.title', read_only=True)
    seller_name = serializers.CharField(source='product.listing.seller.username', read_only=True)  # or 'full_name' if you have it
    get_total = serializers.SerializerMethodField()

    class Meta:
        model = OrderItem
        fields = ["id", "product", "product_name", "seller_name", "quantity", "price", "get_total"]

    def get_get_total(self, obj):
        return obj.get_total()



class OrderSerializer(serializers.ModelSerializer):
    buyer = serializers.StringRelatedField(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)

    class Meta:
        model = Order
        fields = ["id", "buyer", "items", "total_amount", "status", "created_at"]
        read_only_fields = ["total_amount"]



# Payment

class PaymentSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = ["id", "order", "transaction", "method", "status", "mpesa_receipt_number", "created_at"]
