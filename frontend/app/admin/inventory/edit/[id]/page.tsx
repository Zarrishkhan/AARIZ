"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string | number;
  category: string;
  site: string;
  stock: number;
};

const API_URL = "http://127.0.0.1:8000/api/products/";

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [site, setSite] = useState("men");
  const [stock, setStock] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOAD PRODUCT
  // ==========================================

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}${id}/`,
          {
            cache: "no-store",
          }
        );

        if (!response.ok) {
          throw new Error(
            `Product could not be loaded. Server returned ${response.status}.`
          );
        }

        const product: Product =
          await response.json();

        setName(product.name || "");
        setDescription(product.description || "");
        setPrice(String(product.price ?? ""));
        setCategory(product.category || "");
        setSite(product.site || "men");
        setStock(String(product.stock ?? ""));

      } catch (error) {
        console.error(
          "PRODUCT LOAD ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load product."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadProduct();
    }
  }, [id]);

  // ==========================================
  // UPDATE PRODUCT
  // ==========================================

  async function updateProduct(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (
      !name.trim() ||
      !description.trim() ||
      !price ||
      !category.trim() ||
      !stock
    ) {
      setError(
        "Please fill in all the fields."
      );
      return;
    }

    if (Number(price) < 0) {
      setError(
        "Price cannot be negative."
      );
      return;
    }

    if (Number(stock) < 0) {
      setError(
        "Stock cannot be negative."
      );
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `${API_URL}${id}/`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            name: name.trim(),
            description:
              description.trim(),
            price: Number(price),
            category: category.trim(),
            site: site,
            stock: Number(stock),
          }),
        }
      );

      const data =
        await response.json();

      console.log(
        "UPDATE RESPONSE:",
        data
      );

      if (!response.ok) {
        throw new Error(
          "Could not update product."
        );
      }

      setSuccess(
        "Product updated successfully."
      );

      // Go back to inventory after a short delay
      setTimeout(() => {
        router.push(
          "/admin/inventory"
        );
      }, 1000);

    } catch (error) {
      console.error(
        "PRODUCT UPDATE ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f4f0]">
        <p className="text-sm text-black/50">
          Loading product...
        </p>
      </main>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

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

          <div className="mx-auto max-w-4xl">

            {/* BACK */}

            <Link
              href="/admin/inventory"
              className="text-xs uppercase tracking-widest text-black/50 hover:text-black"
            >
              ← Back to Inventory
            </Link>


            {/* TITLE */}

            <div className="mt-8">

              <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                AARIZ MANAGEMENT
              </p>

              <h1 className="mt-3 text-4xl font-light">
                Edit Product
              </h1>

              <p className="mt-3 text-sm text-black/50">
                Update the information for this product.
              </p>

            </div>


            {/* FORM */}

            <form
              onSubmit={updateProduct}
              className="mt-10 border border-black/10 bg-white p-6 md:p-8"
            >

              {/* PRODUCT NAME */}

              <div>

                <label className="mb-2 block text-xs uppercase tracking-wider text-black/50">
                  Product Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  className="w-full border border-black/20 bg-white px-4 py-4 text-sm outline-none focus:border-black"
                />

              </div>


              {/* DESCRIPTION */}

              <div className="mt-6">

                <label className="mb-2 block text-xs uppercase tracking-wider text-black/50">
                  Description
                </label>

                <textarea
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
                  rows={5}
                  className="w-full resize-none border border-black/20 bg-white px-4 py-4 text-sm outline-none focus:border-black"
                />

              </div>


              {/* PRICE + STOCK */}

              <div className="mt-6 grid gap-6 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-xs uppercase tracking-wider text-black/50">
                    Price
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={price}
                    onChange={(e) =>
                      setPrice(
                        e.target.value
                      )
                    }
                    className="w-full border border-black/20 bg-white px-4 py-4 text-sm outline-none focus:border-black"
                  />

                </div>


                <div>

                  <label className="mb-2 block text-xs uppercase tracking-wider text-black/50">
                    Stock
                  </label>

                  <input
                    type="number"
                    min="0"
                    value={stock}
                    onChange={(e) =>
                      setStock(
                        e.target.value
                      )
                    }
                    className="w-full border border-black/20 bg-white px-4 py-4 text-sm outline-none focus:border-black"
                  />

                </div>

              </div>


              {/* CATEGORY */}

              <div className="mt-6">

                <label className="mb-2 block text-xs uppercase tracking-wider text-black/50">
                  Category
                </label>

                <input
                  type="text"
                  value={category}
                  onChange={(e) =>
                    setCategory(
                      e.target.value
                    )
                  }
                  className="w-full border border-black/20 bg-white px-4 py-4 text-sm outline-none focus:border-black"
                />

              </div>


              {/* SITE */}

              <div className="mt-6">

                <label className="mb-2 block text-xs uppercase tracking-wider text-black/50">
                  Collection
                </label>

                <select
                  value={site}
                  onChange={(e) =>
                    setSite(e.target.value)
                  }
                  className="w-full border border-black/20 bg-white px-4 py-4 text-sm outline-none focus:border-black"
                >

                  <option value="men">
                    Boys / Men's
                  </option>

                  <option value="girls">
                    Girls
                  </option>

                </select>

              </div>


              {/* ERROR */}

              {error && (

                <div className="mt-6 border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                  {error}
                </div>

              )}


              {/* SUCCESS */}

              {success && (

                <div className="mt-6 border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                  {success}
                </div>

              )}


              {/* BUTTONS */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-black py-5 text-xs tracking-[0.15em] text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "SAVING CHANGES..."
                    : "SAVE CHANGES"}
                </button>

                <Link
                  href="/admin/inventory"
                  className="flex items-center justify-center border border-black/20 px-8 py-5 text-xs tracking-[0.15em] transition hover:border-black"
                >
                  CANCEL
                </Link>

              </div>

            </form>

          </div>

        </section>

      </div>

    </main>
  );
}