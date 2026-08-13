"use client";

import Link from "next/link";
import { useState } from "react";

const API_URL = "http://127.0.0.1:8000/api/products/";

const BACKEND_URL = "http://127.0.0.1:8000";

export default function NewProductPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [site, setSite] = useState("men");
  const [stock, setStock] = useState("");

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // IMAGE SELECTION
  // =====================================================

  function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files);

    // Add new files to existing files
    const updatedImages = [
      ...images,
      ...selectedFiles,
    ];

    setImages(updatedImages);

    // Create previews
    const newPreviews = selectedFiles.map((file) =>
      URL.createObjectURL(file)
    );

    setPreviews([
      ...previews,
      ...newPreviews,
    ]);

    // Reset input so the same file can be selected again
    e.target.value = "";
  }

  // =====================================================
  // REMOVE IMAGE
  // =====================================================

  function removeImage(index: number) {
    URL.revokeObjectURL(previews[index]);

    setImages((current) =>
      current.filter((_, i) => i !== index)
    );

    setPreviews((current) =>
      current.filter((_, i) => i !== index)
    );
  }

  // =====================================================
  // CREATE PRODUCT
  // =====================================================

  async function createProduct(
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
      setError("Please fill in all the fields.");
      return;
    }

    if (Number(price) < 0) {
      setError("Price cannot be negative.");
      return;
    }

    if (Number(stock) < 0) {
      setError("Stock cannot be negative.");
      return;
    }

    if (images.length === 0) {
      setError("Please select at least one product image.");
      return;
    }

    setLoading(true);

    try {
      // =================================================
      // FORM DATA
      // =================================================

      const formData = new FormData();

      formData.append(
        "name",
        name.trim()
      );

      formData.append(
        "description",
        description.trim()
      );

      formData.append(
        "price",
        price
      );

      formData.append(
        "category",
        category.trim()
      );

      formData.append(
        "site",
        site
      );

      formData.append(
        "stock",
        stock
      );

      // =================================================
      // ADD ALL IMAGES
      // =================================================

      images.forEach((image) => {
        formData.append(
          "image_files",
          image
        );
      });

      console.log(
        "Uploading",
        images.length,
        "images"
      );

      // IMPORTANT:
      // Don't manually set Content-Type.
      // Browser creates multipart/form-data boundary.
      const response = await fetch(
        API_URL,
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText =
        await response.text();

      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        data = responseText;
      }

      console.log(
        "PRODUCT CREATE RESPONSE:",
        data
      );

      if (!response.ok) {
        console.error(
          "Product creation error:",
          data
        );

        throw new Error(
          typeof data === "object"
            ? JSON.stringify(data)
            : "Could not create product."
        );
      }

      // =================================================
      // SUCCESS
      // =================================================

      setSuccess(
        "Product created successfully."
      );

      // Clear form

      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setSite("men");
      setStock("");

      previews.forEach((preview) =>
        URL.revokeObjectURL(preview)
      );

      setImages([]);
      setPreviews([]);

    } catch (error) {
      console.error(
        "CREATE PRODUCT ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Could not create the product."
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

          <div className="mx-auto max-w-4xl">

            {/* BACK */}

            <Link
              href="/admin/products"
              className="text-xs uppercase tracking-widest text-black/50 hover:text-black"
            >
              ← Back to Products
            </Link>


            {/* TITLE */}

            <div className="mt-8">

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
              onSubmit={createProduct}
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
                  placeholder="e.g. Classic Black T-Shirt"
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
                    setDescription(e.target.value)
                  }
                  placeholder="Describe the product..."
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
                      setPrice(e.target.value)
                    }
                    placeholder="2499"
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
                      setStock(e.target.value)
                    }
                    placeholder="20"
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
                    setCategory(e.target.value)
                  }
                  placeholder="e.g. summers"
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
                    Boys
                  </option>

                  <option value="girls">
                    Girls
                  </option>

                </select>

              </div>


              {/* =================================================
                  IMAGES
              ================================================= */}

              <div className="mt-8">

                <label className="mb-2 block text-xs uppercase tracking-wider text-black/50">
                  Product Images
                </label>

                <p className="mb-4 text-xs text-black/40">
                  Select multiple images for this product.
                </p>


                {/* FILE INPUT */}

                <label className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed border-black/20 bg-[#faf9f6] px-6 py-10 text-center transition hover:border-black">

                  <span className="text-sm font-medium">
                    Select Product Images
                  </span>

                  <span className="mt-2 text-xs text-black/40">
                    You can select multiple images
                  </span>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />

                </label>


                {/* IMAGE PREVIEWS */}

                {images.length > 0 && (

                  <div className="mt-6">

                    <div className="mb-4 flex items-center justify-between">

                      <p className="text-xs uppercase tracking-wider text-black/50">
                        Selected Images
                      </p>

                      <p className="text-xs text-black/40">
                        {images.length}{" "}
                        {images.length === 1
                          ? "image"
                          : "images"}
                      </p>

                    </div>


                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">

                      {previews.map(
                        (preview, index) => (

                          <div
                            key={`${preview}-${index}`}
                            className="group relative aspect-[3/4] overflow-hidden bg-[#e8e6e1]"
                          >

                            <img
                              src={preview}
                              alt={`Product image ${
                                index + 1
                              }`}
                              className="h-full w-full object-cover"
                            />


                            {/* IMAGE NUMBER */}

                            <div className="absolute left-2 top-2 bg-black px-2 py-1 text-[9px] text-white">
                              {index + 1}
                            </div>


                            {/* REMOVE */}

                            <button
                              type="button"
                              onClick={() =>
                                removeImage(
                                  index
                                )
                              }
                              className="absolute right-2 top-2 bg-white px-2 py-1 text-[9px] text-black opacity-90 transition hover:bg-black hover:text-white"
                            >
                              Remove
                            </button>

                          </div>

                        )
                      )}

                    </div>

                  </div>

                )}

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
                  disabled={loading}
                  className="flex-1 bg-black py-5 text-xs tracking-[0.15em] text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading
                    ? "CREATING PRODUCT..."
                    : "CREATE PRODUCT"}
                </button>


                <Link
                  href="/admin/products"
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