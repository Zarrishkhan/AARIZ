from django.contrib import admin

from .models import Product, ProductImage


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "name",
        "category",
        "site",
        "price",
        "stock",
        "created_at",
    )

    list_filter = (
        "site",
        "category",
    )

    search_fields = (
        "name",
        "category",
        "description",
    )

    ordering = (
        "-created_at",
    )

    inlines = [
        ProductImageInline,
    ]


@admin.register(ProductImage)
class ProductImageAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "product",
        "image",
        "created_at",
    )

    search_fields = (
        "product__name",
    )

