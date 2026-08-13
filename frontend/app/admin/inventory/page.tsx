"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  category: string;
  price: string | number;
  stock: number;
};

const API_URL = "http://127.0.0.1:8000/api/products/";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL, {
          method: "GET",
          cache: "no-store",
        });

        console.log("Inventory API:", API_URL);
        console.log("Inventory status:", response.status);

        if (!response.ok) {
          throw new Error(
            `Failed to load inventory. Server returned ${response.status}.`
          );
        }

        const data = await response.json();

        console.log("Inventory data:", data);

        const productList: Product[] = Array.isArray(data)
          ? data
          : data.results || [];

        setProducts(productList);
      } catch (error) {
        console.error("Inventory loading error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load inventory."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return "Out of stock";
    }

    if (stock <= 5) {
      return "Low stock";
    }

    return "In stock";
  };

  return (
    <main className="min-h-screen bg-[#f5f4f0] text-[#171717]">

      {/* HEADER */}

      <header className="border-b border-black/10 bg-white">
        <div className="flex h-20 items-center justify-between px-6">

          <Link
            href="/admin"
            className="text-2xl font-semibold tracking-[0.35em]"
          >
            AARIZ
          </Link>

          <Link
            href="/"
            className="text-sm text-black/50 hover:text-black"
          >
            View Store
          </Link>

        </div>
      </header>

      <div className="flex min-h-[calc(100vh-80px)]">

        {/* SIDEBAR */}

        <aside className="hidden w-64 border-r border-black/10 bg-white md:block">

          <div className="p-6">

            <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
              Management
            </p>

            <nav className="mt-6 space-y-1">

              <Link
                href="/admin"
                className="block px-4 py-3 text-sm hover:bg-black/5"
              >
                Dashboard
              </Link>

              <Link
                href="/admin/products"
                className="block px-4 py-3 text-sm hover:bg-black/5"
              >
                Products
              </Link>

              <Link
                href="/admin/orders"
                className="block px-4 py-3 text-sm hover:bg-black/5"
              >
                Orders
              </Link>

              <Link
                href="/admin/inventory"
                className="block bg-black px-4 py-3 text-sm text-white"
              >
                Inventory
              </Link>

            </nav>

          </div>

        </aside>

        {/* MAIN */}

        <section className="flex-1 p-6 md:p-10">

          <div className="mx-auto max-w-7xl">

            {/* TITLE */}

            <div>

              <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                AARIZ MANAGEMENT
              </p>

              <h1 className="mt-3 text-4xl font-light">
                Inventory
              </h1>

              <p className="mt-3 text-sm text-black/50">
                Monitor product stock levels.
              </p>

            </div>

            {/* SUMMARY */}

            <div className="mt-10 grid gap-5 sm:grid-cols-3">

              {/* TOTAL PRODUCTS */}

              <div className="border border-black/10 bg-white p-6">

                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  Total Products
                </p>

                <p className="mt-4 text-4xl font-light">
                  {loading ? "—" : products.length}
                </p>

              </div>

              {/* LOW STOCK */}

              <div className="border border-black/10 bg-white p-6">

                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  Low Stock
                </p>

                <p className="mt-4 text-4xl font-light">
                  {loading
                    ? "—"
                    : products.filter(
                        (product) =>
                          product.stock > 0 &&
                          product.stock <= 5
                      ).length}
                </p>

              </div>

              {/* OUT OF STOCK */}

              <div className="border border-black/10 bg-white p-6">

                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  Out of Stock
                </p>

                <p className="mt-4 text-4xl font-light">
                  {loading
                    ? "—"
                    : products.filter(
                        (product) => product.stock === 0
                      ).length}
                </p>

              </div>

            </div>

            {/* INVENTORY TABLE */}

            <div className="mt-10 border border-black/10 bg-white">

              <div className="border-b border-black/10 p-6">

                <h2 className="text-xl font-medium">
                  Stock Overview
                </h2>

                <p className="mt-1 text-xs text-black/40">
                  Current stock from your products database
                </p>

              </div>

              {/* LOADING */}

              {loading && (

                <div className="p-10 text-center">

                  <p className="text-sm text-black/40">
                    Loading inventory...
                  </p>

                </div>

              )}

              {/* ERROR */}

              {error && (

                <div className="p-10 text-center">

                  <p className="text-sm text-red-600">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-4 border border-black px-4 py-2 text-xs hover:bg-black hover:text-white"
                  >
                    Try Again
                  </button>

                </div>

              )}

              {/* EMPTY */}

              {!loading &&
                !error &&
                products.length === 0 && (

                  <div className="p-10 text-center">

                    <p className="text-sm text-black/40">
                      No products found.
                    </p>

                  </div>
                )}

              {/* TABLE */}

              {!loading &&
                !error &&
                products.length > 0 && (

                  <div className="overflow-x-auto">

                    <table className="w-full">

                      <thead>

                        <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wider text-black/40">

                          <th className="px-6 py-4">
                            Product
                          </th>

                          <th className="px-6 py-4">
                            Category
                          </th>

                          <th className="px-6 py-4">
                            Price
                          </th>

                          <th className="px-6 py-4">
                            Stock
                          </th>

                          <th className="px-6 py-4">
                            Status
                          </th>

                        </tr>

                      </thead>

                      <tbody>

                        {products.map((product) => (

                          <tr
                            key={product.id}
                            className="border-b border-black/5 last:border-0"
                          >

                            {/* PRODUCT */}

                            <td className="px-6 py-5 text-sm font-medium">
                              {product.name}
                            </td>

                            {/* CATEGORY */}

                            <td className="px-6 py-5 text-sm text-black/60">
                              {product.category}
                            </td>

                            {/* PRICE */}

                            <td className="px-6 py-5 text-sm">
                              Rs.{" "}
                              {Number(
                                product.price
                              ).toLocaleString()}
                            </td>

                            {/* STOCK */}

                            <td className="px-6 py-5 text-sm">
                              {product.stock}
                            </td>

                            {/* STATUS */}

                            <td className="px-6 py-5">

                              <span
                                className={`text-xs ${
                                  product.stock === 0
                                    ? "text-red-600"
                                    : product.stock <= 5
                                    ? "text-orange-600"
                                    : "text-green-700"
                                }`}
                              >
                                {getStockStatus(
                                  product.stock
                                )}
                              </span>

                            </td>

                          </tr>

                        ))}

                      </tbody>

                    </table>

                  </div>

                )}

            </div>

            {/* BACK BUTTON */}

            <div className="mt-8">

              <Link
                href="/admin"
                className="text-xs underline"
              >
                ← Back to Dashboard
              </Link>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}