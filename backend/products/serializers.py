from rest_framework import serializers

from .models import Product, ProductImage


class ProductImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProductImage

        fields = [
            "id",
            "image",
        ]


class ProductSerializer(serializers.ModelSerializer):

    # Images returned by the API
    images = ProductImageSerializer(
        many=True,
        read_only=True
    )

    # Images uploaded when creating a product
    image_files = serializers.ListField(
        child=serializers.ImageField(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Product

        fields = [
            "id",
            "name",
            "description",
            "price",
            "category",
            "site",
            "stock",
            "created_at",
            "images",
            "image_files",
        ]

        read_only_fields = [
            "id",
            "created_at",
            "images",
        ]

    def create(self, validated_data):

        # Get uploaded images
        image_files = validated_data.pop(
            "image_files",
            []
        )

        # Create product
        product = Product.objects.create(
            **validated_data
        )

        # Create ProductImage for every uploaded image
        for image in image_files:

            ProductImage.objects.create(
                product=product,
                image=image
            )

        return product