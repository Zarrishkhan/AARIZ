from django.db import transaction
from rest_framework import generics

from .models import Order
from .serializers import OrderSerializer


class OrderListCreateView(generics.ListCreateAPIView):

    queryset = Order.objects.all().order_by("-created_at")
    serializer_class = OrderSerializer


class OrderDetailView(generics.RetrieveUpdateDestroyAPIView):

    queryset = Order.objects.all()
    serializer_class = OrderSerializer

    @transaction.atomic
    def update(self, request, *args, **kwargs):

        order = self.get_object()

        old_status = order.status
        new_status = request.data.get(
            "status",
            old_status
        )

        # -----------------------------------------
        # CANCEL ORDER
        # -----------------------------------------

        if (
            old_status != "cancelled"
            and new_status == "cancelled"
        ):

            for item in order.items.all():

                if item.product:

                    item.product.stock += item.quantity

                    item.product.save(
                        update_fields=["stock"]
                    )

        # -----------------------------------------
        # REOPEN CANCELLED ORDER
        # -----------------------------------------

        elif (
            old_status == "cancelled"
            and new_status != "cancelled"
        ):

            for item in order.items.all():

                if item.product:

                    if item.product.stock < item.quantity:

                        from rest_framework.exceptions import ValidationError

                        raise ValidationError({
                            "status": (
                                f"Not enough stock for "
                                f"{item.product.name}."
                            )
                        })

                    item.product.stock -= item.quantity

                    item.product.save(
                        update_fields=["stock"]
                    )

        return super().update(
            request,
            *args,
            **kwargs
        )