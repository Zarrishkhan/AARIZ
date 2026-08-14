"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type CartItem = {
  id: number;
  productId?: number;
  name: string;
  price: number;
  size: string;
  quantity: number;
  image?: string;
};

const BACKEND_URL = "https://zarrishkhan12.pythonanywhere.com";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  const getImageUrl = (
    image?: string
  ) => {
    if (!image) return "";

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    if (image.startsWith("/")) {
      return `${BACKEND_URL}${image}`;
    }

    return `${BACKEND_URL}/${image}`;
  };

  /* LOAD CART */

  const loadCart = () => {
    try {
      /*
        First use "cart".
      */

      let saved =
        localStorage.getItem("cart");

      /*
        If there is nothing there, check
        the previous key too.
      */

      if (!saved) {
        saved =
          localStorage.getItem(
            "aariz-cart"
          );
      }

      if (!saved) {
        setCart([]);
        setLoaded(true);
        return;
      }

      const parsed =
        JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setCart(parsed);

        /*
          Make sure the current key is
          synchronized.
        */

        localStorage.setItem(
          "cart",
          JSON.stringify(parsed)
        );
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

    setLoaded(true);
  };

  /* INITIAL LOAD */

  useEffect(() => {
    loadCart();

    const handleCartUpdate =
      () => {
        loadCart();
      };

    window.addEventListener(
      "cartUpdated",
      handleCartUpdate
    );

    return () => {
      window.removeEventListener(
        "cartUpdated",
        handleCartUpdate
      );
    };
  }, []);

  /* SAVE CART */

  const saveCart = (
    newCart: CartItem[]
  ) => {
    setCart(newCart);

    const data =
      JSON.stringify(newCart);

    localStorage.setItem(
      "cart",
      data
    );

    localStorage.setItem(
      "aariz-cart",
      data
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  /* INCREASE */

  const increaseQuantity = (
    id: number,
    size: string
  ) => {
    const newCart =
      cart.map((item) => {

        if (
          Number(item.id) ===
            Number(id) &&
          item.size === size
        ) {
          return {
            ...item,
            quantity:
              Number(item.quantity) + 1,
          };
        }

        return item;
      });

    saveCart(newCart);
  };

  /* DECREASE */

  const decreaseQuantity = (
    id: number,
    size: string
  ) => {
    const newCart =
      cart
        .map((item) => {

          if (
            Number(item.id) ===
              Number(id) &&
            item.size === size
          ) {
            return {
              ...item,
              quantity:
                Number(item.quantity) - 1,
            };
          }

          return item;
        })
        .filter(
          (item) =>
            Number(item.quantity) > 0
        );

    saveCart(newCart);
  };

  /* REMOVE */

  const removeItem = (
    id: number,
    size: string
  ) => {
    const newCart =
      cart.filter(
        (item) =>
          !(
            Number(item.id) ===
              Number(id) &&
            item.size === size
          )
      );

    saveCart(newCart);
  };

  /* CLEAR */

  const clearCart = () => {
    setCart([]);

    localStorage.removeItem(
      "cart"
    );

    localStorage.removeItem(
      "aariz-cart"
    );

    window.dispatchEvent(
      new Event("cartUpdated")
    );
  };

  /* TOTAL */

  const total =
    cart.reduce(
      (sum, item) =>
        sum +
        Number(item.price) *
          Number(item.quantity),
      0
    );

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#faf9f6]">

        <div className="flex min-h-screen items-center justify-center">

          <p className="text-sm text-black/50">
            Loading cart...
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#171717]">

      {/* NAVBAR */}

      <nav className="border-b border-black/10 bg-[#faf9f6]">

        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link
            href="/"
            className="text-2xl font-semibold tracking-[0.35em]"
          >
            AARIZ
          </Link>

          <div className="flex gap-7 text-sm">

            <Link
              href="/"
              className="hover:opacity-50"
            >
              Home
            </Link>

            <Link
              href="/products"
              className="hover:opacity-50"
            >
              Shop
            </Link>

            <Link
              href="/cart"
              className="font-medium"
            >
              Cart
            </Link>

          </div>

        </div>

      </nav>


      {/* CONTENT */}

      <section className="mx-auto max-w-7xl px-6 py-16">

        <div className="flex items-end justify-between border-b border-black/10 pb-8">

          <div>

            <p className="text-xs uppercase tracking-[0.3em] text-black/40">
              AARIZ
            </p>

            <h1 className="mt-3 text-4xl font-light">
              Your Cart
            </h1>

          </div>

          {cart.length > 0 && (
            <p className="text-sm text-black/40">
              {cart.length}{" "}
              {cart.length === 1
                ? "item"
                : "items"}
            </p>
          )}

        </div>


        {/* EMPTY */}

        {cart.length === 0 ? (

          <div className="flex min-h-[55vh] flex-col items-center justify-center text-center">

            <h2 className="text-2xl font-light">
              Your cart is empty
            </h2>

            <p className="mt-3 text-sm text-black/50">
              Products you add will appear here.
            </p>

            <Link
              href="/products"
              className="mt-8 bg-black px-8 py-4 text-sm tracking-[0.15em] text-white"
            >
              CONTINUE SHOPPING
            </Link>

          </div>

        ) : (

          <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_350px]">

            {/* PRODUCTS */}

            <div className="space-y-5">

              {cart.map(
                (item) => (

                  <div
                    key={`${item.id}-${item.size}`}
                    className="border border-black/10 bg-white p-5"
                  >

                    <div className="flex gap-5">

                      {/* IMAGE */}

                      <Link
                        href={`/product/${
                          item.productId ||
                          item.id
                        }`}
                        className="h-32 w-24 shrink-0 overflow-hidden bg-[#e8e5df]"
                      >

                        {item.image ? (

                          <img
                            src={getImageUrl(
                              item.image
                            )}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />

                        ) : (

                          <div className="flex h-full items-center justify-center text-xs text-black/30">
                            AARIZ
                          </div>

                        )}

                      </Link>


                      {/* DETAILS */}

                      <div className="flex flex-1 flex-col">

                        <div className="flex justify-between gap-5">

                          <div>

                            <h2 className="font-medium">
                              {item.name}
                            </h2>

                            <p className="mt-2 text-sm text-black/50">
                              Size:{" "}
                              {item.size}
                            </p>

                            <p className="mt-2 text-sm">
                              Rs.{" "}
                              {Number(
                                item.price
                              ).toLocaleString()}
                            </p>

                          </div>

                          <p className="font-medium">
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


                        {/* CONTROLS */}

                        <div className="mt-auto flex items-center justify-between pt-5">

                          <div className="flex items-center border border-black/20">

                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(
                                  item.id,
                                  item.size
                                )
                              }
                              className="px-4 py-2 hover:bg-black hover:text-white"
                            >
                              −
                            </button>

                            <span className="min-w-[40px] text-center text-sm">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(
                                  item.id,
                                  item.size
                                )
                              }
                              className="px-4 py-2 hover:bg-black hover:text-white"
                            >
                              +
                            </button>

                          </div>


                          <button
                            type="button"
                            onClick={() =>
                              removeItem(
                                item.id,
                                item.size
                              )
                            }
                            className="text-sm text-black/50 underline underline-offset-4 hover:text-black"
                          >
                            Remove
                          </button>

                        </div>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>


            {/* SUMMARY */}

            <div className="h-fit border border-black/10 bg-white p-7 lg:sticky lg:top-28">

              <p className="text-xs uppercase tracking-[0.25em] text-black/40">
                Summary
              </p>

              <h2 className="mt-3 text-2xl font-light">
                Order Summary
              </h2>

              <div className="mt-8 flex justify-between">

                <span className="text-black/60">
                  Subtotal
                </span>

                <span>
                  Rs.{" "}
                  {total.toLocaleString()}
                </span>

              </div>

              <div className="mt-4 flex justify-between text-sm text-black/50">

                <span>
                  Shipping
                </span>

                <span>
                  Calculated at checkout
                </span>

              </div>

              <div className="my-7 border-t border-black/10" />

              <div className="flex justify-between text-lg font-medium">

                <span>
                  Total
                </span>

                <span>
                  Rs.{" "}
                  {total.toLocaleString()}
                </span>

              </div>

              <button
                type="button"
                onClick={() => {
                  window.location.href =
                    "/checkout";
                }}
                className="mt-8 w-full bg-black py-4 text-sm tracking-[0.15em] text-white hover:bg-black/80"
              >
                CHECKOUT
              </button>

              <button
                type="button"
                onClick={clearCart}
                className="mt-4 w-full border border-black/20 py-4 text-sm hover:border-black"
              >
                CLEAR CART
              </button>

            </div>

          </div>

        )}

      </section>


      {/* FOOTER */}

      <footer className="bg-[#171717] px-6 py-12 text-white">

        <div className="mx-auto max-w-7xl">

          <div className="flex justify-between">

            <Link
              href="/"
              className="text-2xl font-semibold tracking-[0.35em]"
            >
              AARIZ
            </Link>

            <div className="flex gap-6 text-sm text-white/50">

              <Link href="/">
                Home
              </Link>

              <Link href="/products">
                Shop
              </Link>

              <Link href="/cart">
                Cart
              </Link>

            </div>

          </div>

          <div className="mt-8 border-t border-white/10 pt-6 text-xs text-white/30">
            © 2026 AARIZ. All rights reserved.
          </div>

        </div>

      </footer>

    </main>
  );
}