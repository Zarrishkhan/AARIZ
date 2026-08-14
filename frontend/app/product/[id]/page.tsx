"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type ProductImage = {
  id: number;
  image: string;
};

type Product = {
  id: number;
  name: string;
  description: string;
  price: string | number;
  category: string;
  site: string;
  stock: number;
  created_at: string;
  images: ProductImage[];
};

const API_URL = "https://zarrishkhan12.pythonanywhere.com/api/products/";
const BACKEND_URL = "https://zarrishkhan12.pythonanywhere.com";
const SIZES = ["XS", "S", "M", "L", "XL"];

export default function ProductPage() {
  const params = useParams();

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [selectedSize, setSelectedSize] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [selectedImage, setSelectedImage] = useState(0);

  const [addingToCart, setAddingToCart] = useState(false);

  const [cartMessage, setCartMessage] = useState("");


  /*
  =====================================================
  IMAGE URL
  =====================================================
  */

  const getImageUrl = (image: string) => {
    if (!image) {
      return "";
    }

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


  /*
  =====================================================
  LOAD PRODUCT
  =====================================================
  */

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        setSelectedImage(0);

        const id = params.id;

        if (!id) {
          throw new Error("Product ID is missing");
        }

        const response = await fetch(
          `${API_URL}${id}/`,
          {
            cache: "no-store",
          }
        );

        console.log(
          "Product API status:",
          response.status
        );

        if (!response.ok) {
          throw new Error(
            `Failed to load product: ${response.status}`
          );
        }

        const data = await response.json();

        console.log(
          "Product:",
          data
        );

        setProduct(data);

      } catch (err) {
        console.error(
          "Product loading error:",
          err
        );

        setError(
          "Product not found. Please go back and select another product."
        );

      } finally {
        setLoading(false);
      }
    }

    loadProduct();

  }, [params.id]);


  /*
  =====================================================
  QUANTITY
  =====================================================
  */

  const increaseQuantity = () => {
    if (!product) {
      return;
    }

    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };


  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };


  /*
  =====================================================
  IMAGE NAVIGATION
  =====================================================
  */

  const nextImage = () => {
    if (!product || product.images.length <= 1) {
      return;
    }

    setSelectedImage((current) => {
      if (current === product.images.length - 1) {
        return 0;
      }

      return current + 1;
    });
  };


  const previousImage = () => {
    if (!product || product.images.length <= 1) {
      return;
    }

    setSelectedImage((current) => {
      if (current === 0) {
        return product.images.length - 1;
      }

      return current - 1;
    });
  };


  /*
  =====================================================
  ADD TO CART
  =====================================================
  */

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    setCartMessage("");

    if (product.stock <= 0) {
      setCartMessage(
        "This product is currently out of stock."
      );

      return;
    }

    if (!selectedSize) {
      setCartMessage(
        "Please select a size first."
      );

      return;
    }

    setAddingToCart(true);

    try {

      /*
      IMPORTANT:
      We use aariz-cart because that is
      what your Cart page and Checkout page use.
      */

      const existingCart =
        localStorage.getItem("aariz-cart");

      let cart: any[] = [];

      if (existingCart) {
        try {
          const parsed =
            JSON.parse(existingCart);

          if (Array.isArray(parsed)) {
            cart = parsed;
          }

        } catch {
          cart = [];
        }
      }


      /*
      FIND SAME PRODUCT + SAME SIZE
      */

      const existingItemIndex =
        cart.findIndex(
          (item) =>
            Number(item.id) === product.id &&
            item.size === selectedSize
        );


      /*
      PRODUCT ALREADY IN CART
      */

      if (existingItemIndex !== -1) {

        const existingItem =
          cart[existingItemIndex];

        const newQuantity =
          Number(existingItem.quantity || 0) +
          quantity;

        if (
          newQuantity >
          product.stock
        ) {

          setCartMessage(
            `Only ${product.stock} item(s) are available in stock.`
          );

          setAddingToCart(false);

          return;
        }

        cart[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
        };

      } else {

        /*
        NEW CART ITEM
        */

        cart.push({
          id: product.id,

          name: product.name,

          price: Number(product.price),

          size: selectedSize,

          quantity: quantity,

          image:
            product.images &&
            product.images.length > 0
              ? getImageUrl(
                  product.images[0].image
                )
              : "",
        });

      }


      /*
      SAVE CART
      */

      localStorage.setItem(
        "aariz-cart",
        JSON.stringify(cart)
      );


      /*
      NOTIFY OTHER COMPONENTS
      */

      window.dispatchEvent(
        new Event("cartUpdated")
      );


      setCartMessage(
        "Added to cart successfully."
      );

    } catch (err) {

      console.error(
        "Cart error:",
        err
      );

      setCartMessage(
        "Something went wrong while adding the product."
      );

    } finally {

      setAddingToCart(false);

    }
  };


  /*
  =====================================================
  LOADING PAGE
  =====================================================
  */

  if (loading) {

    return (

      <main className="min-h-screen bg-[#faf9f6] text-[#171717]">

        <nav className="border-b border-black/10 bg-[#faf9f6]">

          <div className="mx-auto flex h-20 max-w-7xl items-center px-6">

            <Link
              href="/"
              className="text-2xl font-semibold tracking-[0.35em]"
            >
              AARIZ
            </Link>

            <div className="ml-auto flex items-center gap-7">

              <Link
                href="/products"
                className="text-sm hover:opacity-50"
              >
                Shop
              </Link>

              <Link
                href="/cart"
                className="text-sm hover:opacity-50"
              >
                Cart
              </Link>

            </div>

          </div>

        </nav>

        <div className="flex min-h-[70vh] items-center justify-center">

          <p className="text-sm text-black/50">
            Loading product...
          </p>

        </div>

      </main>

    );
  }


  /*
  =====================================================
  ERROR PAGE
  =====================================================
  */

  if (error || !product) {

    return (

      <main className="min-h-screen bg-[#faf9f6] text-[#171717]">

        <nav className="border-b border-black/10 bg-[#faf9f6]">

          <div className="mx-auto flex h-20 max-w-7xl items-center px-6">

            <Link
              href="/"
              className="text-2xl font-semibold tracking-[0.35em]"
            >
              AARIZ
            </Link>

            <div className="ml-auto flex items-center gap-7">

              <Link
                href="/products"
                className="text-sm hover:opacity-50"
              >
                Shop
              </Link>

              <Link
                href="/cart"
                className="text-sm hover:opacity-50"
              >
                Cart
              </Link>

            </div>

          </div>

        </nav>


        <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">

          <p className="text-xs uppercase tracking-[0.3em] text-black/40">
            AARIZ
          </p>

          <h1 className="mt-4 text-4xl font-light">
            Product not found
          </h1>

          <p className="mt-4 max-w-md text-sm leading-6 text-black/50">
            {error ||
              "We couldn't find the product you were looking for."}
          </p>

          <Link
            href="/products"
            className="mt-8 bg-black px-8 py-4 text-sm tracking-[0.15em] text-white transition hover:bg-black/80"
          >
            BACK TO SHOP
          </Link>

        </div>

      </main>

    );
  }


  /*
  =====================================================
  PRODUCT DATA
  =====================================================
  */

  const images = product.images || [];


  /*
  =====================================================
  MAIN PAGE
  =====================================================
  */

  return (

    <main className="min-h-screen bg-[#faf9f6] text-[#171717]">


      {/* =================================================
          NAVBAR
      ================================================= */}

      <nav className="sticky top-0 z-50 border-b border-black/10 bg-[#faf9f6]/95 backdrop-blur">

        <div className="mx-auto flex h-20 max-w-7xl items-center px-6">

          <Link
            href="/"
            className="text-2xl font-semibold tracking-[0.35em]"
          >
            AARIZ
          </Link>

          <div className="ml-auto flex items-center gap-7">

            <Link
              href="/products"
              className="text-sm transition hover:opacity-50"
            >
              Shop
            </Link>

            <Link
              href="/cart"
              className="text-sm transition hover:opacity-50"
            >
              Cart
            </Link>

          </div>

        </div>

      </nav>


      {/* =================================================
          BREADCRUMB
      ================================================= */}

      <div className="mx-auto max-w-7xl px-6 pt-8">

        <Link
          href="/products"
          className="text-xs uppercase tracking-[0.2em] text-black/40 transition hover:text-black"
        >
          ← Back to Shop
        </Link>

      </div>


      {/* =================================================
          PRODUCT SECTION
      ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-10 md:py-16">

        <div className="grid gap-12 md:grid-cols-2 md:gap-16">


          {/* =================================================
              IMAGE CAROUSEL
          ================================================= */}

          <div className="w-full">

            {images.length > 0 ? (

              <div className="relative">


                {/* MAIN IMAGE */}

                <div className="relative aspect-[3/4] overflow-hidden bg-[#e8e5df]">

                  <img
                    src={getImageUrl(
                      images[selectedImage].image
                    )}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />


                  {/* LEFT ARROW */}

                  {images.length > 1 && (

                    <button
                      type="button"
                      onClick={previousImage}
                      aria-label="Previous image"
                      className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl shadow-md transition hover:scale-105 hover:bg-white"
                    >
                      ←
                    </button>

                  )}


                  {/* RIGHT ARROW */}

                  {images.length > 1 && (

                    <button
                      type="button"
                      onClick={nextImage}
                      aria-label="Next image"
                      className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl shadow-md transition hover:scale-105 hover:bg-white"
                    >
                      →
                    </button>

                  )}


                  {/* IMAGE COUNTER */}

                  {images.length > 1 && (

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 px-4 py-2 text-xs tracking-wider text-white">
                      {selectedImage + 1} / {images.length}
                    </div>

                  )}

                </div>


                {/* =================================================
                    THUMBNAILS
                ================================================= */}

                {images.length > 1 && (

                  <div className="mt-4 flex gap-3 overflow-x-auto pb-2">

                    {images.map(
                      (item, index) => (

                        <button
                          key={item.id}
                          type="button"
                          onClick={() =>
                            setSelectedImage(index)
                          }
                          aria-label={`View image ${index + 1}`}
                          className={`relative h-24 w-20 flex-shrink-0 overflow-hidden border-2 transition ${
                            selectedImage === index
                              ? "border-black"
                              : "border-transparent"
                          }`}
                        >

                          <img
                            src={getImageUrl(
                              item.image
                            )}
                            alt={`${product.name} thumbnail ${
                              index + 1
                            }`}
                            className="h-full w-full object-cover"
                          />

                        </button>

                      )
                    )}

                  </div>

                )}

              </div>

            ) : (

              <div className="flex aspect-[3/4] items-center justify-center bg-[#e8e5df]">

                <p className="text-sm uppercase tracking-[0.25em] text-black/30">
                  AARIZ
                </p>

              </div>

            )}

          </div>


          {/* =================================================
              PRODUCT INFORMATION
          ================================================= */}

          <div className="md:sticky md:top-28 md:h-fit">


            {/* COLLECTION */}

            <p className="text-xs uppercase tracking-[0.25em] text-black/40">

              {product.site === "girls"
                ? "Girls Collection"
                : "Boys Collection"}

            </p>


            {/* NAME */}

            <h1 className="mt-4 text-4xl font-light leading-tight md:text-5xl">

              {product.name}

            </h1>


            {/* PRICE */}

            <p className="mt-5 text-xl">

              Rs.{" "}
              {Number(
                product.price
              ).toLocaleString()}

            </p>


            {/* STOCK */}

            <div className="mt-6">

              {product.stock > 0 ? (

                <p className="text-sm text-black/50">

                  {product.stock} item
                  {product.stock === 1
                    ? ""
                    : "s"}{" "}
                  available

                </p>

              ) : (

                <p className="text-sm font-medium">

                  Out of stock

                </p>

              )}

            </div>


            {/* DESCRIPTION */}

            <div className="mt-8 border-t border-black/10 pt-8">

              <p className="text-sm leading-7 text-black/60">

                {product.description}

              </p>

            </div>


            {/* =================================================
                SIZE
            ================================================= */}

            {product.stock > 0 && (

              <div className="mt-9">

                <div className="mb-4 flex items-center justify-between">

                  <p className="text-sm font-medium">

                    Select Size

                  </p>

                  <button
                    type="button"
                    className="text-xs text-black/50 underline underline-offset-4 transition hover:text-black"
                    onClick={() =>
                      setCartMessage(
                        "Please choose the size that fits your child best."
                      )
                    }
                  >
                    Size Guide
                  </button>

                </div>


                <div className="flex flex-wrap gap-2">

                  {SIZES.map(
                    (size) => (

                      <button
                        key={size}
                        type="button"
                        onClick={() => {

                          setSelectedSize(
                            size
                          );

                          setCartMessage("");

                        }}
                        className={`min-w-[58px] border px-5 py-3 text-sm transition ${
                          selectedSize === size
                            ? "border-black bg-black text-white"
                            : "border-black/20 bg-white hover:border-black"
                        }`}
                      >

                        {size}

                      </button>

                    )
                  )}

                </div>

              </div>

            )}


            {/* =================================================
                QUANTITY
            ================================================= */}

            {product.stock > 0 && (

              <div className="mt-8">

                <p className="mb-3 text-sm font-medium">

                  Quantity

                </p>


                <div className="flex w-fit items-center border border-black/20">

                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <= 1
                    }
                    className="px-5 py-3 text-lg transition hover:bg-black/5 disabled:opacity-30"
                  >
                    −
                  </button>


                  <span className="min-w-[50px] text-center text-sm">

                    {quantity}

                  </span>


                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      quantity >=
                      product.stock
                    }
                    className="px-5 py-3 text-lg transition hover:bg-black/5 disabled:opacity-30"
                  >
                    +
                  </button>

                </div>

              </div>

            )}


            {/* =================================================
                ADD TO CART
            ================================================= */}

            <div className="mt-9">

              <button
                type="button"
                onClick={
                  handleAddToCart
                }
                disabled={
                  product.stock <= 0 ||
                  addingToCart
                }
                className={`w-full px-8 py-4 text-sm tracking-[0.15em] transition ${
                  product.stock <= 0
                    ? "cursor-not-allowed bg-black/20 text-black/40"
                    : "bg-black text-white hover:bg-black/80"
                }`}
              >

                {product.stock <= 0
                  ? "OUT OF STOCK"
                  : addingToCart
                  ? "ADDING..."
                  : "ADD TO CART"}

              </button>


              {/* CART MESSAGE */}

              {cartMessage && (

                <p
                  className={`mt-4 text-center text-sm ${
                    cartMessage.includes(
                      "successfully"
                    )
                      ? "text-green-700"
                      : "text-red-600"
                  }`}
                >

                  {cartMessage}

                </p>

              )}

            </div>


            {/* =================================================
                VIEW CART
            ================================================= */}

            <Link
              href="/cart"
              className="mt-4 block w-full border border-black/20 px-8 py-4 text-center text-sm tracking-[0.15em] transition hover:border-black"
            >
              VIEW CART
            </Link>


            {/* =================================================
                PRODUCT DETAILS
            ================================================= */}

            <div className="mt-10 border-t border-black/10">


              {/* CATEGORY */}

              <div className="border-b border-black/10 py-5">

                <p className="text-xs uppercase tracking-[0.2em] text-black/40">

                  Category

                </p>

                <p className="mt-2 text-sm">

                  {product.category}

                </p>

              </div>


              {/* COLLECTION */}

              <div className="border-b border-black/10 py-5">

                <p className="text-xs uppercase tracking-[0.2em] text-black/40">

                  Collection

                </p>

                <p className="mt-2 text-sm">

                  {product.site === "girls"
                    ? "Girls"
                    : "Boys"}

                </p>

              </div>


              {/* SIZES */}

              <div className="py-5">

                <p className="text-xs uppercase tracking-[0.2em] text-black/40">

                  Available Sizes

                </p>

                <p className="mt-2 text-sm">

                  XS · S · M · L · XL

                </p>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="mt-10 bg-[#171717] px-6 py-14 text-white">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">


            {/* LOGO */}

            <Link
              href="/"
              className="text-2xl font-semibold tracking-[0.35em]"
            >
              AARIZ
            </Link>


            {/* LINKS */}

            <div className="flex gap-6 text-sm text-white/50">

              <Link
                href="/"
                className="transition hover:text-white"
              >
                Home
              </Link>

              <Link
                href="/products"
                className="transition hover:text-white"
              >
                Shop
              </Link>

              <Link
                href="/cart"
                className="transition hover:text-white"
              >
                Cart
              </Link>

            </div>

          </div>


          {/* COPYRIGHT */}

          <div className="mt-10 border-t border-white/10 pt-6 text-xs text-white/30">

            © 2026 AARIZ. All rights reserved.

          </div>

        </div>

      </footer>

    </main>
  );
}