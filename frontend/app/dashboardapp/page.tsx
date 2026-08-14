
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  price: string | number;
  category: string;
  site: string;
  stock: number;
  created_at: string;
  images?: {
    id: number;
    image: string;
  }[];
  image?: string;
};

const API_URL = "https://zarrishkhan12.pythonanywhere.com/api/products/";

export default function DashboardPage() {
  const [active, setActive] = useState("All Products");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const menuItems = [
    "All Products",
    "Boys",
    "Girls",
    "New Arrivals",
    "T-Shirts",
    "Shirts",
    "Dresses",
    "Sets",
  ];

  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);

        const response = await fetch(API_URL, {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to load products");
        }

        const data = await response.json();

        /*
          Django REST Framework normally returns:
          [
            {...},
            {...}
          ]

          But if pagination is enabled it returns:
          {
            results: [...]
          }
        */

        if (Array.isArray(data)) {
          setProducts(data);
        } else if (Array.isArray(data.results)) {
          setProducts(data.results);
        } else {
          setProducts([]);
        }
      } catch (err) {
        console.error("Dashboard product error:", err);
        setError("Unable to load products.");
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  /*
  =====================================================
  FILTER PRODUCTS
  =====================================================
  */

  const filteredProducts = products.filter((product) => {
    if (active === "All Products") {
      return true;
    }

    if (active === "Boys") {
      return product.site === "men";
    }

    if (active === "Girls") {
      return product.site === "girls";
    }

    if (active === "New Arrivals") {
      return true;
    }

    const category = product.category?.toLowerCase() || "";

    return category === active.toLowerCase();
  });

  /*
  =====================================================
  PRODUCT IMAGE
  =====================================================
  */

  const getProductImage = (product: Product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0].image;
    }

    if (product.image) {
      return product.image;
    }

    return "";
  };

  /*
  =====================================================
  LOADING
  =====================================================
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#faf9f6] text-[#171717]">
        <nav className="border-b border-black/10 bg-white">
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
            <Link
              href="/"
              className="text-2xl font-semibold tracking-[0.35em]"
            >
              AARIZ
            </Link>
          </div>
        </nav>

        <div className="flex min-h-[500px] items-center justify-center">
          <p className="text-sm text-black/50">
            Loading products...
          </p>
        </div>
      </main>
    );
  }

  /*
  =====================================================
  PAGE
  =====================================================
  */

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#171717]">

      {/* NAVBAR */}

      <nav className="border-b border-black/10 bg-white">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">

          <Link
            href="/"
            className="text-2xl font-semibold tracking-[0.35em]"
          >
            AARIZ
          </Link>

          <div className="flex items-center gap-8 text-sm">

            <Link href="/" className="hover:opacity-50">
              Home
            </Link>

            <Link href="/products" className="hover:opacity-50">
              Shop
            </Link>

            <Link href="/cart" className="hover:opacity-50">
              Cart
            </Link>

          </div>

        </div>
      </nav>


      {/* DASHBOARD */}

      <div className="mx-auto flex max-w-7xl">

        {/* SIDEBAR */}

        <aside className="hidden min-h-[calc(100vh-80px)] w-64 border-r border-black/10 bg-white px-7 py-10 md:block">

          <p className="text-xs font-medium uppercase tracking-[0.25em] text-gray-400">
            Customer Dashboard
          </p>

          <h2 className="mt-3 text-2xl font-light">
            Shop
          </h2>

          <div className="mt-8">

            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gray-400">
              Categories
            </p>

            <div className="space-y-1">

              {menuItems.map((item) => (

                <button
                  key={item}
                  type="button"
                  onClick={() => setActive(item)}
                  className={`block w-full px-3 py-3 text-left text-sm transition ${
                    active === item
                      ? "bg-black text-white"
                      : "hover:bg-black/5"
                  }`}
                >
                  {item}
                </button>

              ))}

            </div>

          </div>


          {/* ACCOUNT */}

          <div className="mt-12 border-t border-black/10 pt-8">

            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-gray-400">
              Account
            </p>

            <div className="space-y-1">

              <Link
                href="/order-tracking"
                className="block px-3 py-3 text-sm hover:bg-black/5"
              >
                My Orders
              </Link>

              <Link
                href="/cart"
                className="block px-3 py-3 text-sm hover:bg-black/5"
              >
                My Cart
              </Link>

            </div>

          </div>

        </aside>


        {/* MAIN CONTENT */}

        <section className="flex-1 px-6 py-10 md:px-12">

          <div className="flex items-end justify-between">

            <div>

              <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
                AARIZ Collection
              </p>

              <h1 className="mt-2 text-4xl font-light md:text-5xl">
                {active}
              </h1>

            </div>

            <Link
              href="/products"
              className="hidden text-sm underline underline-offset-4 md:block"
            >
              View all
            </Link>

          </div>


          {/* ERROR */}

          {error && (
            <div className="mt-10 border border-red-200 bg-red-50 p-5 text-sm text-red-600">
              {error}
            </div>
          )}


          {/* PRODUCTS */}

          {!error && filteredProducts.length > 0 && (

            <div className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3">

              {filteredProducts.map((product) => {

                const image = getProductImage(product);

                return (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    className="group"
                  >

                    {/* IMAGE */}

                    <div className="relative aspect-[3/4] overflow-hidden bg-[#eeeeeb]">

                      {image ? (

                        <img
                          src={image}
                          alt={product.name}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center text-sm text-gray-400">
                          AARIZ
                        </div>

                      )}

                      {/* STOCK */}

                      {product.stock <= 0 && (
                        <div className="absolute left-3 top-3 bg-black px-3 py-2 text-xs text-white">
                          OUT OF STOCK
                        </div>
                      )}

                    </div>


                    {/* INFO */}

                    <div className="mt-4">

                      <h3 className="text-sm font-medium">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Rs.{" "}
                        {Number(product.price).toLocaleString()}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {product.stock > 0
                          ? `${product.stock} available`
                          : "Out of stock"}
                      </p>

                    </div>

                  </Link>
                );
              })}

            </div>
          )}


          {/* NO PRODUCTS */}

          {!error && filteredProducts.length === 0 && (

            <div className="mt-16 border border-black/10 bg-white p-12 text-center">

              <h2 className="text-xl font-light">
                No products found
              </h2>

              <p className="mt-3 text-sm text-gray-500">
                There are currently no products in this category.
              </p>

              <button
                type="button"
                onClick={() => setActive("All Products")}
                className="mt-6 bg-black px-6 py-3 text-sm text-white"
              >
                VIEW ALL PRODUCTS
              </button>

            </div>
          )}

        </section>

      </div>

    </main>
  );
}
