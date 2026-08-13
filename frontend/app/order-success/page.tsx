"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
  id: number;
  customer_name: string;
  phone: string;
  address: string;
  city: string;
  total: string;
  status: string;
  created_at: string;
};

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const savedOrder = localStorage.getItem("aariz-last-order");

    if (savedOrder) {
      try {
        setOrder(JSON.parse(savedOrder));
      } catch {
        setOrder(null);
      }
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#171717]">

      {/* NAVBAR */}

      <nav className="border-b border-black/10">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link
            href="/"
            className="text-2xl font-semibold tracking-[0.3em]"
          >
            AARIZ
          </Link>

          <Link
            href="/products"
            className="text-sm hover:opacity-50"
          >
            Continue Shopping
          </Link>

        </div>
      </nav>


      {/* SUCCESS */}

      <section className="mx-auto max-w-2xl px-6 py-20 text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-black text-2xl text-white">
          ✓
        </div>

        <p className="mt-8 text-xs tracking-[0.35em] text-black/45">
          ORDER CONFIRMED
        </p>

        <h1 className="mt-4 text-5xl font-light">
          Thank you for your order.
        </h1>

        <p className="mx-auto mt-6 max-w-lg leading-7 text-black/55">
          Your AARIZ order has been successfully placed.
          We will process your order and prepare it for delivery.
        </p>


        {/* ORDER DETAILS */}

        {order && (
          <div className="mt-12 border border-black/10 bg-white p-8 text-left">

            <div className="flex justify-between border-b border-black/10 pb-6">

              <div>
                <p className="text-xs tracking-widest text-black/40">
                  ORDER NUMBER
                </p>

                <p className="mt-2 text-2xl">
                  #{order.id}
                </p>
              </div>

              <div className="text-right">

                <p className="text-xs tracking-widest text-black/40">
                  STATUS
                </p>

                <p className="mt-2 capitalize">
                  {order.status}
                </p>

              </div>

            </div>


            <div className="mt-7 space-y-4">

              <div>
                <p className="text-xs text-black/40">
                  Customer
                </p>

                <p className="mt-1">
                  {order.customer_name}
                </p>
              </div>


              <div>
                <p className="text-xs text-black/40">
                  Delivery Address
                </p>

                <p className="mt-1">
                  {order.address}
                </p>

                <p className="text-sm text-black/50">
                  {order.city}
                </p>
              </div>


              <div>
                <p className="text-xs text-black/40">
                  Phone
                </p>

                <p className="mt-1">
                  {order.phone}
                </p>
              </div>


              <div className="border-t border-black/10 pt-5">

                <div className="flex justify-between">

                  <span className="font-medium">
                    Total
                  </span>

                  <span className="font-medium">
                    Rs.{" "}
                    {Number(order.total).toLocaleString()}
                  </span>

                </div>

              </div>

            </div>

          </div>
        )}


        {/* BUTTONS */}

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">

          {order && (
            <Link
              href={`/order-tracking?order=${order.id}`}
              className="bg-black px-8 py-4 text-sm tracking-widest text-white hover:bg-gray-800"
            >
              TRACK ORDER
            </Link>
          )}

          <Link
            href="/products"
            className="border border-black px-8 py-4 text-sm tracking-widest hover:bg-black hover:text-white"
          >
            CONTINUE SHOPPING
          </Link>

        </div>

      </section>

    </main>
  );
}