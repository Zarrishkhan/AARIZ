"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/products/";
const BACKEND_URL = "http://127.0.0.1:8000";

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
  stock: number;
  created_at: string;
  images?: ProductImage[];
  image?: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [deletingId, setDeletingId] = useState<number | null>(null);

  /*
  =====================================================
  GET IMAGE URL
  =====================================================
  */

  const getImageUrl = (image?: string) => {
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
  LOAD PRODUCTS
  =====================================================
  */

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load products");
      }

      const data = await response.json();

      const productList: Product[] = Array.isArray(data)
        ? data
        : data.results || [];

      setProducts(productList);
    } catch (error) {
      console.error("Products loading error:", error);

      setError(
        "Unable to load products. Make sure Django is running."
      );
    } finally {
      setLoading(false);
    }
  };

  /*
  =====================================================
  LOAD ON PAGE OPEN
  =====================================================
  */

  useEffect(() => {
    loadProducts();
  }, []);

  /*
  =====================================================
  DELETE PRODUCT
  =====================================================
  */

  const deleteProduct = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const response = await fetch(`${API_URL}${id}/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete product");
      }

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) => product.id !== id
        )
      );
    } catch (error) {
      console.error("Delete error:", error);

      alert(
        "Could not delete the product."
      );
    } finally {
      setDeletingId(null);
    }
  };

  /*
  =====================================================
  SEARCH
  =====================================================
  */

  const filteredProducts = products.filter((product) => {
    const text = search.trim().toLowerCase();

    if (!text) {
      return true;
    }

    return (
      product.name.toLowerCase().includes(text) ||
      product.category.toLowerCase().includes(text) ||
      product.description.toLowerCase().includes(text)
    );
  });

  /*
  =====================================================
  PAGE
  =====================================================
  */

  return (
    <main className="min-h-screen bg-[#f5f4f0] text-[#171717]">

      {/* HEADER */}

      <header className="border-b border-black/10 bg-white">

        <div className="flex h-20 items-center justify-between px-6">

          <Link
            href="/"
            className="text-2xl font-semibold tracking-[0.35em]"
          >
            AARIZ
          </Link>

          <div className="flex items-center gap-6">

            <Link
              href="/"
              className="text-sm text-black/50 hover:text-black"
            >
              View Store
            </Link>

            <Link
              href="/admin"
              className="text-sm hover:opacity-50"
            >
              Dashboard
            </Link>

          </div>

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


        {/* MAIN */}

        <section className="flex-1 p-6 md:p-10">

          <div className="mx-auto max-w-7xl">

            {/* TITLE */}

            <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">

              <div>

                <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                  AARIZ MANAGEMENT
                </p>

                <h1 className="mt-3 text-4xl font-light">
                  Products
                </h1>

                <p className="mt-3 text-sm text-black/50">
                  Add, edit and manage your store products.
                </p>

              </div>


              {/* ADD PRODUCT */}

              <Link
                href="/admin/products/new"
                className="inline-block bg-black px-6 py-4 text-xs tracking-[0.15em] text-white transition hover:bg-gray-800"
              >
                ADD PRODUCT
              </Link>

            </div>


            {/* SEARCH */}

            <div className="mt-10 border border-black/10 bg-white p-5">

              <label className="mb-3 block text-[10px] uppercase tracking-[0.25em] text-black/40">
                Search Products
              </label>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search by name, category or description..."
                className="w-full border border-black/10 bg-[#faf9f6] px-4 py-4 text-sm outline-none focus:border-black"
              />

            </div>


            {/* ERROR */}

            {error && (

              <div className="mt-6 border border-red-200 bg-red-50 p-5 text-sm text-red-600">
                {error}
              </div>

            )}


            {/* LOADING */}

            {loading ? (

              <div className="mt-10 border border-black/10 bg-white p-16 text-center">

                <p className="text-sm text-black/40">
                  Loading products...
                </p>

              </div>

            ) : (

              <>

                {/* RESULTS */}

                <div className="mt-8 flex items-center justify-between">

                  <p className="text-xs text-black/40">
                    {filteredProducts.length} products
                  </p>

                  <button
                    type="button"
                    onClick={loadProducts}
                    className="text-xs underline"
                  >
                    Refresh
                  </button>

                </div>


                {/* PRODUCT TABLE */}

                <div className="mt-4 overflow-hidden border border-black/10 bg-white">

                  {filteredProducts.length === 0 ? (

                    <div className="p-16 text-center">

                      <h2 className="text-xl font-light">
                        No products found
                      </h2>

                      <p className="mt-2 text-sm text-black/40">
                        Add a product or change your search.
                      </p>

                    </div>

                  ) : (

                    <div className="overflow-x-auto">

                      <table className="w-full min-w-[900px]">

                        <thead>

                          <tr className="border-b border-black/10 text-left text-[10px] uppercase tracking-[0.2em] text-black/40">

                            <th className="px-6 py-5">
                              Product
                            </th>

                            <th className="px-6 py-5">
                              Category
                            </th>

                            <th className="px-6 py-5">
                              Price
                            </th>

                            <th className="px-6 py-5">
                              Stock
                            </th>

                            <th className="px-6 py-5">
                              Actions
                            </th>

                          </tr>

                        </thead>


                        <tbody>

                          {filteredProducts.map(
                            (product) => {

                              const imagePath =
                                product.images &&
                                product.images.length > 0
                                  ? product.images[0].image
                                  : product.image || "";

                              const imageUrl =
                                getImageUrl(imagePath);


                              return (

                                <tr
                                  key={product.id}
                                  className="border-b border-black/5 last:border-0"
                                >

                                  {/* PRODUCT */}

                                  <td className="px-6 py-5">

                                    <div className="flex items-center gap-4">

                                      <div className="h-20 w-16 overflow-hidden bg-[#e6e3dd]">

                                        {imageUrl ? (

                                          <img
                                            src={imageUrl}
                                            alt={product.name}
                                            className="h-full w-full object-cover"
                                          />

                                        ) : (

                                          <div className="flex h-full items-center justify-center text-[9px] text-black/30">
                                            AARIZ
                                          </div>

                                        )}

                                      </div>


                                      <div>

                                        <p className="text-sm font-medium">
                                          {product.name}
                                        </p>

                                        <p className="mt-1 text-xs text-black/40">
                                          ID: #{product.id}
                                        </p>

                                      </div>

                                    </div>

                                  </td>


                                  {/* CATEGORY */}

                                  <td className="px-6 py-5">

                                    <span className="text-xs uppercase tracking-wider text-black/50">
                                      {product.category}
                                    </span>

                                  </td>


                                  {/* PRICE */}

                                  <td className="px-6 py-5">

                                    <span className="text-sm">
                                      Rs.{" "}
                                      {Number(
                                        product.price
                                      ).toLocaleString()}
                                    </span>

                                  </td>


                                  {/* STOCK */}

                                  <td className="px-6 py-5">

                                    {product.stock === 0 ? (

                                      <span className="text-xs font-medium text-red-600">
                                        Out of stock
                                      </span>

                                    ) : product.stock <= 5 ? (

                                      <span className="text-xs font-medium">
                                        {product.stock} — Low stock
                                      </span>

                                    ) : (

                                      <span className="text-xs">
                                        {product.stock} available
                                      </span>

                                    )}

                                  </td>


                                  {/* ACTIONS */}

                                  <td className="px-6 py-5">

                                    <div className="flex items-center gap-4">

                                      <Link
                                        href={`/admin/products/${product.id}`}
                                        className="text-xs underline hover:opacity-50"
                                      >
                                        Edit
                                      </Link>

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
                                        className="text-xs text-red-600 hover:opacity-50 disabled:opacity-40"
                                      >
                                        {deletingId ===
                                        product.id
                                          ? "Deleting..."
                                          : "Delete"}
                                      </button>

                                    </div>

                                  </td>

                                </tr>

                              );

                            }
                          )}

                        </tbody>

                      </table>

                    </div>

                  )}

                </div>

              </>

            )}

          </div>

        </section>

      </div>

    </main>
  );
}