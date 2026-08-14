"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description?: string;
  price: string | number;
  category: string;
  site?: string;
  stock: number;
  created_at?: string;
  image?: string;
  images?: {
    id: number;
    image: string;
  }[];
};

const API_URL =
  "https://zarrishkhan12.pythonanywhere.com/api/products/";

const BACKEND_URL =
  "https://zarrishkhan12.pythonanywhere.com";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to load products (${response.status})`
          );
        }

        const data = await response.json();

        const productList: Product[] = Array.isArray(data)
          ? data
          : data.results || [];

        setProducts(productList);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  function getImage(product: Product) {
    if (product.images && product.images.length > 0) {
      const image = product.images[0].image;

      if (image.startsWith("http")) {
        return image;
      }

      return `${BACKEND_URL}${image}`;
    }

    if (product.image) {
      if (product.image.startsWith("http")) {
        return product.image;
      }

      return `${BACKEND_URL}${product.image}`;
    }

    return null;
  }

  return (
    <main className="min-h-screen bg-[#f8f8f6] text-black">

      {/* NAVBAR */}

      <nav className="border-b border-black/10 bg-[#f8f8f6]">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link
            href="/"
            className="text-2xl font-medium tracking-[0.35em]"
          >
            AARIZ
          </Link>

          <div className="flex items-center gap-8 text-xs uppercase tracking-[0.2em]">

            <Link
              href="/products"
              className="hover:opacity-50"
            >
              Products
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


      {/* HEADER */}

      <section className="mx-auto max-w-7xl px-6 pb-12 pt-16">

        <p className="text-xs uppercase tracking-[0.3em] text-black/40">
          AARIZ COLLECTION
        </p>

        <h1 className="mt-4 text-5xl font-light tracking-tight">
          All Products
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-6 text-black/50">
          Explore the latest AARIZ collection.
        </p>

      </section>


      {/* ERROR */}

      {error && (
        <div className="mx-auto max-w-7xl px-6 pb-10">

          <div className="border border-red-200 bg-red-50 p-5 text-sm text-red-700">
            {error}
          </div>

        </div>
      )}


      {/* LOADING */}

      {loading && (
        <section className="mx-auto max-w-7xl px-6 pb-20">

          <div className="py-20 text-center">

            <p className="text-sm text-black/40">
              Loading products...
            </p>

          </div>

        </section>
      )}


      {/* PRODUCTS */}

      {!loading && !error && (
        <section className="mx-auto max-w-7xl px-6 pb-24">

          {products.length === 0 ? (

            <div className="py-20 text-center">

              <p className="text-lg font-light">
                No products available.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">

              {products.map((product) => {

                const image = getImage(product);

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group block"
                  >

                    {/* IMAGE */}

                    <div className="relative aspect-[4/5] overflow-hidden bg-[#e9e9e5]">

                      {image ? (
                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.2em] text-black/30">
                          AARIZ
                        </div>
                      )}

                    </div>


                    {/* INFO */}

                    <div className="mt-5">

                      <div className="flex items-start justify-between gap-4">

                        <div>

                          <h2 className="text-sm font-medium">
                            {product.name}
                          </h2>

                          <p className="mt-2 text-xs uppercase tracking-[0.15em] text-black/40">
                            {product.category}
                          </p>

                        </div>

                        <p className="text-sm">
                          Rs.{" "}
                          {Number(product.price).toLocaleString()}
                        </p>

                      </div>


                      {/* STOCK */}

                      <div className="mt-4">

                        {product.stock > 0 ? (
                          <p className="text-xs text-black/40">
                            In stock
                          </p>
                        ) : (
                          <p className="text-xs text-red-500">
                            Out of stock
                          </p>
                        )}

                      </div>

                    </div>

                  </Link>
                );
              })}

            </div>

          )}

        </section>
      )}

    </main>
  );
}