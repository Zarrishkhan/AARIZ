"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  name: string;
  price: number;
  size?: string;
  quantity: number;
  image?: string;
};

const CART_KEY = "aariz-cart";

const ORDERS_API =
  "http://127.0.0.1:8000/api/orders/";

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [customerName, setCustomerName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [address, setAddress] =
    useState("");

  const [city, setCity] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  /*
  =====================================================
  LOAD CART
  =====================================================
  */

  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem(CART_KEY);

      if (!savedCart) {
        setCart([]);
        return;
      }

      const parsedCart =
        JSON.parse(savedCart);

      if (Array.isArray(parsedCart)) {
        setCart(parsedCart);
      } else {
        setCart([]);
      }
    } catch (error) {
      console.error(
        "Cart loading error:",
        error
      );

      setCart([]);
    }
  }, []);

  /*
  =====================================================
  TOTAL
  =====================================================
  */

  const total = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        Number(item.quantity),
    0
  );

  /*
  =====================================================
  CLEAR CART
  =====================================================
  */

  const clearCart = () => {
    // Remove the actual cart
    localStorage.removeItem(CART_KEY);

    // Also remove old cart key if it exists
    localStorage.removeItem("cart");

    // Update React state immediately
    setCart([]);

    // Tell other components that cart changed
    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  /*
  =====================================================
  PLACE ORDER
  =====================================================
  */

  const placeOrder = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    setError("");

    /*
    -----------------------------------------------------
    CHECK CART
    -----------------------------------------------------
    */

    if (cart.length === 0) {
      setError(
        "Your cart is empty."
      );

      return;
    }

    /*
    -----------------------------------------------------
    CHECK CUSTOMER DETAILS
    -----------------------------------------------------
    */

    if (
      !customerName.trim() ||
      !phone.trim() ||
      !address.trim() ||
      !city.trim()
    ) {
      setError(
        "Please fill in all the fields."
      );

      return;
    }

    /*
    -----------------------------------------------------
    CHECK SIZES
    -----------------------------------------------------
    */

    for (const item of cart) {
      if (
        !item.size ||
        item.size.trim() === ""
      ) {
        setError(
          `Please select a size for ${item.name}.`
        );

        return;
      }
    }

    setLoading(true);

    try {
      /*
      =================================================
      CREATE ORDER DATA
      =================================================
      */

      const orderData = {
        customer_name:
          customerName.trim(),

        phone:
          phone.trim(),

        address:
          address.trim(),

        city:
          city.trim(),

        total:
          total,

        items: cart.map((item) => ({
          product:
            Number(item.id),

          size:
            item.size,

          quantity:
            Number(item.quantity),

          price:
            Number(item.price),
        })),
      };

      console.log(
        "ORDER SENT TO DJANGO:",
        orderData
      );

      /*
      =================================================
      SEND TO DJANGO
      =================================================
      */

      const response =
        await fetch(
          ORDERS_API,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                orderData
              ),
          }
        );

      /*
      =================================================
      READ RESPONSE
      =================================================
      */

      let data: any = null;

      try {
        data =
          await response.json();
      } catch {
        data = null;
      }

      console.log(
        "DJANGO STATUS:",
        response.status
      );

      console.log(
        "DJANGO RESPONSE:",
        data
      );

      /*
      =================================================
      ORDER FAILED
      =================================================
      */

      if (!response.ok) {
        let message =
          "Could not place your order.";

        if (
          data &&
          typeof data === "object"
        ) {
          if (data.items) {
            message =
              Array.isArray(data.items)
                ? data.items.join(" ")
                : JSON.stringify(
                    data.items
                  );
          } else if (data.detail) {
            message =
              String(data.detail);
          } else {
            message =
              JSON.stringify(data);
          }
        }

        setError(message);

        return;
      }

      /*
      =================================================
      ORDER SUCCESSFUL
      =================================================
      */

      console.log(
        "ORDER SUCCESSFUL"
      );

      /*
      -------------------------------------------------
      SAVE LAST ORDER
      -------------------------------------------------
      */

      localStorage.setItem(
        "aariz-last-order",
        JSON.stringify(data)
      );

      /*
      -------------------------------------------------
      VERY IMPORTANT:
      CLEAR CART ONLY AFTER
      DJANGO CONFIRMS SUCCESS
      -------------------------------------------------
      */

      clearCart();

      /*
      -------------------------------------------------
      REDIRECT
      -------------------------------------------------
      */

      window.location.replace(
        "/order-success"
      );
    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      setError(
        "Could not connect to the Django server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  =====================================================
  PAGE
  =====================================================
  */

  return (
    <main className="min-h-screen bg-[#f7f6f2] text-[#171717]">

      {/* NAVBAR */}

      <nav className="border-b border-black/10 bg-[#f7f6f2]">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link
            href="/"
            className="text-2xl font-semibold tracking-[0.3em]"
          >
            AARIZ
          </Link>

          <Link
            href="/cart"
            className="text-sm transition hover:opacity-50"
          >
            Back to Cart
          </Link>

        </div>

      </nav>

      {/* CHECKOUT */}

      <section className="mx-auto max-w-6xl px-6 py-16">

        <p className="text-xs uppercase tracking-[0.3em] text-black/40">
          AARIZ
        </p>

        <h1 className="mt-3 text-4xl font-light md:text-5xl">
          Checkout
        </h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_350px]">

          {/* FORM */}

          <form
            onSubmit={placeOrder}
            className="space-y-6"
          >

            <h2 className="text-2xl font-medium">
              Delivery Information
            </h2>

            {/* NAME */}

            <div>

              <label className="mb-2 block text-sm">
                Full Name
              </label>

              <input
                type="text"
                value={customerName}
                onChange={(e) =>
                  setCustomerName(
                    e.target.value
                  )
                }
                placeholder="Enter your full name"
                disabled={loading}
                className="w-full border border-black/20 bg-white px-4 py-4 outline-none transition focus:border-black disabled:opacity-50"
              />

            </div>

            {/* PHONE */}

            <div>

              <label className="mb-2 block text-sm">
                Phone Number
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value
                  )
                }
                placeholder="03XX XXXXXXX"
                disabled={loading}
                className="w-full border border-black/20 bg-white px-4 py-4 outline-none transition focus:border-black disabled:opacity-50"
              />

            </div>

            {/* ADDRESS */}

            <div>

              <label className="mb-2 block text-sm">
                Delivery Address
              </label>

              <textarea
                value={address}
                onChange={(e) =>
                  setAddress(
                    e.target.value
                  )
                }
                placeholder="Enter your complete address"
                rows={4}
                disabled={loading}
                className="w-full resize-none border border-black/20 bg-white px-4 py-4 outline-none transition focus:border-black disabled:opacity-50"
              />

            </div>

            {/* CITY */}

            <div>

              <label className="mb-2 block text-sm">
                City
              </label>

              <input
                type="text"
                value={city}
                onChange={(e) =>
                  setCity(
                    e.target.value
                  )
                }
                placeholder="Enter your city"
                disabled={loading}
                className="w-full border border-black/20 bg-white px-4 py-4 outline-none transition focus:border-black disabled:opacity-50"
              />

            </div>

            {/* ERROR */}

            {error && (

              <div className="border border-red-200 bg-red-50 p-4">

                <p className="text-sm text-red-600">
                  {error}
                </p>

              </div>

            )}

            {/* PLACE ORDER */}

            <button
              type="submit"
              disabled={
                loading ||
                cart.length === 0
              }
              className="w-full bg-black py-5 text-sm tracking-[0.15em] text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >

              {loading
                ? "PLACING ORDER..."
                : "PLACE ORDER"}

            </button>

          </form>

          {/* ORDER SUMMARY */}

          <div className="h-fit border border-black/10 bg-white p-7">

            <h2 className="text-xl font-medium">
              Order Summary
            </h2>

            {cart.length === 0 ? (

              <div className="py-10 text-center">

                <p className="text-sm text-gray-500">
                  Your cart is empty.
                </p>

                <Link
                  href="/products"
                  className="mt-5 inline-block text-sm underline"
                >
                  Continue Shopping
                </Link>

              </div>

            ) : (

              <div className="mt-8 space-y-5">

                {cart.map(
                  (item, index) => (

                    <div
                      key={`${item.id}-${item.size}-${index}`}
                      className="border-b border-black/10 pb-5"
                    >

                      <div className="flex justify-between gap-4">

                        <div>

                          <p className="text-sm font-medium">
                            {item.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Size:{" "}
                            {item.size ||
                              "Not selected"}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            Quantity:{" "}
                            {item.quantity}
                          </p>

                        </div>

                        <p className="whitespace-nowrap text-sm">

                          Rs.{" "}
                          {(
                            Number(
                              item.price
                            ) *
                            Number(
                              item.quantity
                            )
                          ).toLocaleString()}

                        </p>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

            <div className="my-6 border-t border-black/10" />

            <div className="flex justify-between text-lg font-medium">

              <span>
                Total
              </span>

              <span>
                Rs.{" "}
                {total.toLocaleString()}
              </span>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
