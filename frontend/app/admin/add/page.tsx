"use client";

import Link from "next/link";
import { useState } from "react";

const API_URL = "https://zarrishkhan12.pythonanywhere.com/api/products/";

export default function AddProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [site, setSite] = useState("men");
  const [stock, setStock] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function addProduct(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description,
          price,
          category,
          site,
          stock: Number(stock),
        }),
      });

      const data = await response.json();

      console.log("ADD PRODUCT RESPONSE:", data);

      if (!response.ok) {
        console.error("ADD PRODUCT ERROR:", data);

        throw new Error(
          data.detail ||
            "Unable to add product."
        );
      }

      window.location.href = "/admin/products";

    } catch (err) {
      console.error("ADD PRODUCT ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to add product."
      );

    } finally {
      setLoading(false);
    }
  }

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
              href="/admin/products"
              className="text-sm hover:underline"
            >
              Products
            </Link>

          </div>

        </div>

      </header>


      {/* MAIN */}

      <section className="mx-auto max-w-3xl px-6 py-12 md:py-16">

        <div>

          <p className="text-xs uppercase tracking-[0.3em] text-black/40">
            AARIZ MANAGEMENT
          </p>

          <h1 className="mt-3 text-4xl font-light">
            Add Product
          </h1>

          <p className="mt-3 text-sm text-black/50">
            Add a new product to your store.
          </p>

        </div>


        {/* FORM */}

        <form
          onSubmit={addProduct}
          className="mt-10 border border-black/10 bg-white p-6 md:p-8"
        >

          {/* NAME */}

          <div>

            <label className="text-xs uppercase tracking-[0.15em] text-black/50">
              Product Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              required
              placeholder="Black Oversized T-Shirt"
              className="mt-2 w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
            />

          </div>


          {/* DESCRIPTION */}

          <div className="mt-6">

            <label className="text-xs uppercase tracking-[0.15em] text-black/50">
              Description
            </label>

            <textarea
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              required
              rows={5}
              placeholder="Describe the product..."
              className="mt-2 w-full resize-none border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
            />

          </div>


          {/* PRICE + STOCK */}

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>

              <label className="text-xs uppercase tracking-[0.15em] text-black/50">
                Price
              </label>

              <input
                type="number"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value)
                }
                required
                placeholder="2499"
                className="mt-2 w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
              />

            </div>


            <div>

              <label className="text-xs uppercase tracking-[0.15em] text-black/50">
                Stock
              </label>

              <input
                type="number"
                min="0"
                value={stock}
                onChange={(e) =>
                  setStock(e.target.value)
                }
                required
                placeholder="20"
                className="mt-2 w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
              />

            </div>

          </div>


          {/* CATEGORY + SITE */}

          <div className="mt-6 grid gap-6 md:grid-cols-2">

            <div>

              <label className="text-xs uppercase tracking-[0.15em] text-black/50">
                Category
              </label>

              <input
                type="text"
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                required
                placeholder="T-Shirts"
                className="mt-2 w-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-black"
              />

            </div>


            <div>

              <label className="text-xs uppercase tracking-[0.15em] text-black/50">
                Collection
              </label>

              <select
                value={site}
                onChange={(e) =>
                  setSite(e.target.value)
                }
                className="mt-2 w-full border border-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-black"
              >

                <option value="men">
                  Boys
                </option>

                <option value="girls">
                  Girls
                </option>

              </select>

            </div>

          </div>


          {/* ERROR */}

          {error && (

            <div className="mt-6 border border-red-200 bg-red-50 px-4 py-3">

              <p className="text-sm text-red-700">
                {error}
              </p>

            </div>

          )}


          {/* BUTTONS */}

          <div className="mt-8 flex gap-3">

            <button
              type="submit"
              disabled={loading}
              className="bg-black px-7 py-3 text-xs uppercase tracking-[0.15em] text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Adding..."
                : "Add Product"}
            </button>

            <Link
              href="/admin/products"
              className="border border-black/20 px-7 py-3 text-xs uppercase tracking-[0.15em] transition hover:bg-black hover:text-white"
            >
              Cancel
            </Link>

          </div>

        </form>

      </section>

    </main>
  );
}