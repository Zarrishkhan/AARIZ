"use client";

import { useState } from "react";
import Link from "next/link";

type Order = {
  id: number;
  customer_name: string;
  total: string;
  status: string;
  created_at: string;
};

const API_URL = "http://127.0.0.1:8000/api/orders/";

export default function OrderTrackingPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function trackOrder(e: React.FormEvent) {
    e.preventDefault();

    setError("");
    setOrder(null);

    if (!orderNumber.trim()) {
      setError("Please enter your order number.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}${orderNumber.trim()}/`
      );

      if (!response.ok) {
        throw new Error("Order not found");
      }

      const data = await response.json();

      setOrder(data);
    } catch (error) {
      console.error("Order tracking error:", error);

      setError(
        "Order not found. Please check your order number."
      );
    } finally {
      setLoading(false);
    }
  }

  const statuses = [
    "pending",
    "confirmed",
    "shipped",
    "delivered",
  ];

  const currentStatusIndex = order
    ? statuses.indexOf(order.status)
    : -1;

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

          <div className="flex gap-6 text-sm">

            <Link
              href="/products"
              className="hover:opacity-50"
            >
              Shop
            </Link>

            <Link
              href="/cart"
              className="hover:opacity-50"
            >
              Cart
            </Link>

          </div>

        </div>

      </nav>


      {/* TRACKING */}

      <section className="mx-auto max-w-4xl px-6 py-20">

        <div className="text-center">

          <p className="text-xs tracking-[0.35em] text-black/45">
            AARIZ ORDERS
          </p>

          <h1 className="mt-5 text-5xl font-light">
            Track your order
          </h1>

          <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-black/55">
            Enter your order number to check the current
            status of your AARIZ order.
          </p>

        </div>


        {/* SEARCH FORM */}

        <form
          onSubmit={trackOrder}
          className="mx-auto mt-12 flex max-w-xl gap-3"
        >

          <input
            type="number"
            value={orderNumber}
            onChange={(e) =>
              setOrderNumber(e.target.value)
            }
            placeholder="Enter order number"
            className="w-full border border-black/20 bg-white px-5 py-4 outline-none focus:border-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black px-7 py-4 text-sm tracking-widest text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {loading ? "SEARCHING..." : "TRACK"}
          </button>

        </form>


        {/* ERROR */}

        {error && (
          <div className="mx-auto mt-6 max-w-xl border border-red-200 bg-red-50 p-4 text-center text-sm text-red-600">
            {error}
          </div>
        )}


        {/* ORDER */}

        {order && (

          <div className="mt-14 border border-black/10 bg-white p-8">

            <div className="flex flex-col justify-between gap-5 border-b border-black/10 pb-7 md:flex-row">

              <div>

                <p className="text-xs tracking-widest text-black/40">
                  ORDER NUMBER
                </p>

                <h2 className="mt-2 text-2xl">
                  #{order.id}
                </h2>

              </div>


              <div className="md:text-right">

                <p className="text-xs tracking-widest text-black/40">
                  TOTAL
                </p>

                <p className="mt-2 text-xl">
                  Rs.{" "}
                  {Number(order.total).toLocaleString()}
                </p>

              </div>

            </div>


            {/* CUSTOMER */}

            <div className="mt-8">

              <p className="text-xs tracking-widest text-black/40">
                CUSTOMER
              </p>

              <p className="mt-2">
                {order.customer_name}
              </p>

            </div>


            {/* STATUS */}

            <div className="mt-12">

              <p className="mb-8 text-xs tracking-[0.25em] text-black/45">
                ORDER STATUS
              </p>


              <div className="space-y-7">

                {statuses.map((status, index) => {

                  const completed =
                    index <= currentStatusIndex;

                  return (
                    <div
                      key={status}
                      className="flex items-center gap-5"
                    >

                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full text-sm ${
                          completed
                            ? "bg-black text-white"
                            : "border border-black/20 text-black/30"
                        }`}
                      >
                        {index + 1}
                      </div>


                      <div>

                        <p
                          className={`capitalize ${
                            completed
                              ? "font-medium"
                              : "text-black/35"
                          }`}
                        >
                          {status}
                        </p>

                        {index === currentStatusIndex && (
                          <p className="mt-1 text-xs text-black/45">
                            Current status
                          </p>
                        )}

                      </div>

                    </div>
                  );

                })}

              </div>

            </div>


            {/* DATE */}

            <div className="mt-12 border-t border-black/10 pt-6">

              <p className="text-xs text-black/40">
                Order placed
              </p>

              <p className="mt-1 text-sm">
                {new Date(
                  order.created_at
                ).toLocaleString()}
              </p>

            </div>

          </div>

        )}


        {/* BACK */}

        <div className="mt-10 text-center">

          <Link
            href="/products"
            className="text-sm underline"
          >
            Continue Shopping
          </Link>

        </div>

      </section>

    </main>
  );
}