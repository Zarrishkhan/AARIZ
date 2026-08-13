
from django.contrib import admin

from .models import Order, OrderItem


class OrderItemInline(admin.TabularInline):

    model = OrderItem

    extra = 0


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "customer_name",
        "phone",
        "city",
        "total",
        "status",
        "created_at",
    ]

    list_filter = [
        "status",
        "created_at",
    ]

    search_fields = [
        "customer_name",
        "phone",
        "city",
    ]

    readonly_fields = [
        "created_at",
    ]

    inlines = [
        OrderItemInline,
    ]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):

    list_display = [
        "id",
        "order",
        "product",
        "size",
        "quantity",
        "price",
    ]

    search_fields = [
        "product__name",
        "order__customer_name",
    ]

    list_filter = [
        "size",
    ]

