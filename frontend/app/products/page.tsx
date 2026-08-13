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
};

const API_URL = "http://127.0.0.1:8000/api/products/";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // =====================================================
  // LOAD PRODUCTS
  // =====================================================

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      console.log("REQUESTING:", API_URL);

      const response = await fetch(API_URL, {
        method: "GET",
        cache: "no-store",
      });

      console.log("PRODUCT API STATUS:", response.status);

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          "PRODUCT API RESPONSE:",
          errorText
        );

        throw new Error(
          `Failed to load products. Server returned ${response.status}.`
        );
      }

      const data = await response.json();

      console.log("PRODUCT API DATA:", data);

      const productList: Product[] = Array.isArray(data)
        ? data
        : data.results || [];

      setProducts(productList);
    } catch (error) {
      console.error(
        "PRODUCT LOADING ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadProducts();
  }, []);

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  async function deleteProduct(id: number) {
    const product = products.find(
      (item) => item.id === id
    );

    const confirmed = window.confirm(
      `Are you sure you want to delete "${
        product?.name || "this product"
      }"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      const deleteUrl = `${API_URL}${id}/`;

      console.log("DELETE REQUEST:", deleteUrl);

      const response = await fetch(deleteUrl, {
        method: "DELETE",
      });

      console.log(
        "DELETE STATUS:",
        response.status
      );

      if (!response.ok) {
        const errorText = await response.text();

        console.error(
          "DELETE RESPONSE:",
          errorText
        );

        let message =
          `Delete failed. Server returned ${response.status}.`;

        try {
          const errorData =
            JSON.parse(errorText);

          if (errorData.detail) {
            message = errorData.detail;
          }
        } catch {
          // Response wasn't JSON
        }

        throw new Error(message);
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (item) => item.id !== id
        )
      );

      setSuccess(
        `"${product?.name || "Product"}" deleted successfully.`
      );
    } catch (error) {
      console.error(
        "DELETE PRODUCT ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete product."
      );
    } finally {
      setDeletingId(null);
    }
  }

  // =====================================================
  // STOCK STATUS
  // =====================================================

  function getStockStatus(stock: number) {
    if (stock <= 0) {
      return "Out of stock";
    }

    if (stock <= 5) {
      return "Low stock";
    }

    return "In stock";
  }

  function getStockClass(stock: number) {
    if (stock <= 0) {
      return "bg-red-100 text-red-700";
    }

    if (stock <= 5) {
      return "bg-orange-100 text-orange-700";
    }

    return "bg-green-100 text-green-700";
  }

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalProducts = products.length;

  const inStock = products.filter(
    (product) => product.stock > 5
  ).length;

  const lowOrOut = products.filter(
    (product) => product.stock <= 5
  ).length;

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <main className="min-h-screen bg-[#f5f4f0] text-[#171717]">

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="border-b border-black/10 bg-white">

        <div className="flex h-20 items-center justify-between px-6">

          <Link
            href="/admin"
            className="text-2xl font-semibold tracking-[0.35em]"
          >
            AARIZ
          </Link>

          <div className="flex items-center gap-6">

            <Link
              href="/"
              className="text-sm text-black/50 transition hover:text-black"
            >
              View Store
            </Link>

            <Link
              href="/admin"
              className="text-sm hover:underline"
            >
              Dashboard
            </Link>

          </div>

        </div>

      </header>


      {/* =================================================
          LAYOUT
      ================================================= */}

      <div className="flex min-h-[calc(100vh-80px)]">

        {/* =================================================
            SIDEBAR
        ================================================= */}

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
                className="block bg-black px-4 py-3 text-sm text-white"
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
                className="block px-4 py-3 text-sm hover:bg-black/5"
              >
                Inventory
              </Link>

            </nav>

          </div>

        </aside>


        {/* =================================================
            MAIN
        ================================================= */}

        <section className="flex-1 p-6 md:p-10">

          <div className="mx-auto max-w-7xl">

            {/* =================================================
                TITLE
            ================================================= */}

            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                  AARIZ MANAGEMENT
                </p>

                <h1 className="mt-3 text-4xl font-light">
                  Products
                </h1>

                <p className="mt-3 text-sm text-black/50">
                  Manage all products in your store.
                </p>

              </div>


              {/* =================================================
                  ACTION BUTTONS
              ================================================= */}

              <div className="flex gap-3">

                <Link
                  href="/admin/products/add"
                  className="bg-black px-5 py-3 text-xs text-white transition hover:bg-black/80"
                >
                  Add Product
                </Link>

                <button
                  type="button"
                  onClick={loadProducts}
                  className="border border-black px-5 py-3 text-xs transition hover:bg-black hover:text-white"
                >
                  Refresh
                </button>

              </div>

            </div>


            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {success && (

              <div className="mt-6 border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">

                {success}

              </div>

            )}


            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (

              <div className="mt-6 border border-red-200 bg-red-50 px-5 py-4">

                <p className="text-sm font-medium text-red-700">
                  {error}
                </p>

                <p className="mt-2 text-xs text-red-600">
                  Open your browser console with F12 to
                  see the exact API response.
                </p>

                <p className="mt-3 break-all text-xs text-black/50">
                  API:
                  {" "}
                  {API_URL}
                </p>

              </div>

            )}


            {/* =================================================
                SUMMARY
            ================================================= */}

            <div className="mt-10 grid gap-5 sm:grid-cols-3">

              {/* TOTAL */}

              <div className="border border-black/10 bg-white p-6">

                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  Total Products
                </p>

                <p className="mt-4 text-4xl font-light">
                  {loading ? "—" : totalProducts}
                </p>

              </div>


              {/* IN STOCK */}

              <div className="border border-black/10 bg-white p-6">

                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  In Stock
                </p>

                <p className="mt-4 text-4xl font-light">
                  {loading ? "—" : inStock}
                </p>

              </div>


              {/* LOW / OUT */}

              <div className="border border-black/10 bg-white p-6">

                <p className="text-xs uppercase tracking-[0.2em] text-black/40">
                  Low / Out
                </p>

                <p className="mt-4 text-4xl font-light">
                  {loading ? "—" : lowOrOut}
                </p>

              </div>

            </div>


            {/* =================================================
                PRODUCTS TABLE
            ================================================= */}

            <div className="mt-10 border border-black/10 bg-white">

              <div className="border-b border-black/10 p-6">

                <h2 className="text-xl font-medium">
                  All Products
                </h2>

                <p className="mt-1 text-xs text-black/40">
                  Products currently stored in Django.
                </p>

              </div>


              {/* =================================================
                  LOADING
              ================================================= */}

              {loading && (

                <div className="p-12 text-center">

                  <p className="text-sm text-black/50">
                    Loading products...
                  </p>

                </div>

              )}


              {/* =================================================
                  EMPTY
              ================================================= */}

              {!loading &&
                !error &&
                products.length === 0 && (

                  <div className="p-12 text-center">

                    <p className="text-lg font-light">
                      No products found.
                    </p>

                    <Link
                      href="/admin/products/add"
                      className="mt-6 inline-block bg-black px-6 py-3 text-xs text-white"
                    >
                      Add Your First Product
                    </Link>

                  </div>

                )}


              {/* =================================================
                  TABLE
              ================================================= */}

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
                            Site
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

                          <th className="px-6 py-4 text-right">
                            Actions
                          </th>

                        </tr>

                      </thead>


                      <tbody>

                        {products.map(
                          (product) => (

                            <tr
                              key={product.id}
                              className="border-b border-black/5 last:border-0"
                            >

                              {/* PRODUCT */}

                              <td className="px-6 py-5">

                                <div>

                                  <p className="text-sm font-medium">
                                    {product.name}
                                  </p>

                                  <p className="mt-1 text-xs text-black/40">
                                    ID #{product.id}
                                  </p>

                                </div>

                              </td>


                              {/* CATEGORY */}

                              <td className="px-6 py-5 text-sm text-black/60">
                                {product.category}
                              </td>


                              {/* SITE */}

                              <td className="px-6 py-5 text-sm capitalize text-black/60">
                                {product.site || "men"}
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
                                  className={`rounded-full px-3 py-1 text-xs font-medium ${getStockClass(
                                    product.stock
                                  )}`}
                                >

                                  {getStockStatus(
                                    product.stock
                                  )}

                                </span>

                              </td>


                              {/* ACTIONS */}

                              <td className="px-6 py-5">

                                <div className="flex justify-end gap-2">

                                  {/* EDIT */}

                                  <Link
                                    href={`/admin/inventory/edit/${product.id}`}
                                    className="border border-black/20 px-4 py-2 text-xs transition hover:bg-black hover:text-white"
                                  >
                                    Edit
                                  </Link>


                                  {/* DELETE */}

                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteProduct(
                                        product.id
                                      )
                                    }
                                    disabled={
                                      deletingId ===
                                      product.id
                                    }
                                    className="bg-red-600 px-4 py-2 text-xs text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                  >

                                    {deletingId ===
                                    product.id
                                      ? "Deleting..."
                                      : "Delete"}

                                  </button>

                                </div>

                              </td>

                            </tr>

                          )
                        )}

                      </tbody>

                    </table>

                  </div>

                )}

            </div>


            {/* =================================================
                BACK
            ================================================= */}

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