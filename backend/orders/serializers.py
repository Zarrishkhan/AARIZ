
from django.db import transaction
from rest_framework import serializers

from .models import Order, OrderItem
from products.models import Product


class OrderItemSerializer(
    serializers.ModelSerializer
):

    class Meta:
        model = OrderItem

        fields = [
            "product",
            "quantity",
            "price",
        ]


class OrderSerializer(
    serializers.ModelSerializer
):

    items = OrderItemSerializer(
        many=True,
        write_only=True
    )

    class Meta:
        model = Order

        fields = [
            "id",
            "customer_name",
            "phone",
            "address",
            "city",
            "total",
            "status",
            "created_at",
            "items",
        ]

        read_only_fields = [
            "id",
            "status",
            "created_at",
        ]

    @transaction.atomic
    def create(
        self,
        validated_data
    ):

        items_data = validated_data.pop(
            "items"
        )

        # =================================================
        # CHECK THAT ALL PRODUCTS HAVE ENOUGH STOCK
        # =================================================

        for item_data in items_data:

            product = item_data["product"]

            quantity = item_data["quantity"]

            product = (
                Product.objects
                .select_for_update()
                .get(
                    id=product.id
                )
            )

            if product.stock < quantity:

                raise serializers.ValidationError(
                    {
                        "items": (
                            f"Not enough stock "
                            f"for {product.name}. "
                            f"Only "
                            f"{product.stock} "
                            f"available."
                        )
                    }
                )

        # =================================================
        # CREATE ORDER
        # =================================================

        order = Order.objects.create(
            **validated_data
        )

        # =================================================
        # CREATE ORDER ITEMS
        # AND REDUCE STOCK
        # =================================================

        for item_data in items_data:

            product = item_data["product"]

            quantity = item_data["quantity"]

            # Get the locked product

            product = (
                Product.objects
                .select_for_update()
                .get(
                    id=product.id
                )
            )

            # Create order item

            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                price=item_data["price"]
            )

            # Reduce stock

            product.stock -= quantity

            product.save(
                update_fields=["stock"]
            )

        return order

