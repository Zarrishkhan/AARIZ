from django.db import transaction
from rest_framework import serializers

from .models import Order, OrderItem
from products.models import Product


class OrderItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = OrderItem

        fields = [
            "product",
            "size",
            "quantity",
            "price",
        ]

        extra_kwargs = {
            "size": {
                "required": False,
                "default": "Standard",
            }
        }


class OrderSerializer(serializers.ModelSerializer):

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
            "created_at",
        ]

    @transaction.atomic
    def create(self, validated_data):

        items_data = validated_data.pop("items")

        # ------------------------------------------
        # CHECK ALL STOCK FIRST
        # ------------------------------------------

        locked_products = {}

        for item_data in items_data:

            product_id = item_data["product"].id
            quantity = item_data["quantity"]

            product = (
                Product.objects
                .select_for_update()
                .get(id=product_id)
            )

            if product.stock < quantity:
                raise serializers.ValidationError({
                    "items": [
                        f"Not enough stock for {product.name}. "
                        f"Only {product.stock} available."
                    ]
                })

            locked_products[product_id] = product

        # ------------------------------------------
        # CREATE ORDER
        # ------------------------------------------

        order = Order.objects.create(
            **validated_data
        )

        # ------------------------------------------
        # CREATE ITEMS + REDUCE STOCK
        # ------------------------------------------

        for item_data in items_data:

            product_id = item_data["product"].id
            quantity = item_data["quantity"]

            product = locked_products[product_id]

            OrderItem.objects.create(
                order=order,
                product=product,
                size=item_data.get(
                    "size",
                    "Standard"
                ),
                quantity=quantity,
                price=item_data["price"],
            )

            # REDUCE STOCK
            product.stock = product.stock - quantity

            product.save(
                update_fields=["stock"]
            )

        return order