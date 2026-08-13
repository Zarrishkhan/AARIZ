"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OrderItem = {
  id: number;
  product: number | string;
  size: string;
  quantity: number;
  price: string | number;
};

type Order = {
  id: number;
  customer_name: string;
  phone: string;
  city: string;
  address?: string;
  total: string | number;
  status: string;
  created_at: string;
  items?: OrderItem[];
};

const API_URL = "http://127.0.0.1:8000/api/orders/";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(API_URL, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Failed to load orders");
      }

      const data = await response.json();

      const orderList: Order[] = Array.isArray(data)
        ? data
        : data.results || [];

      setOrders(orderList);
    } catch (error) {
      console.error("Orders loading error:", error);
      setError("Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadOrders();
  }, []);

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  async function updateStatus(
    orderId: number,
    newStatus: string
  ) {
    try {
      const response = await fetch(
        `${API_URL}${orderId}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to update order"
        );
      }

      await loadOrders();
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        "Unable to update order status."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f4f0] text-[#171717]">

      {/* =====================================================
          HEADER
      ===================================================== */}

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

            <span className="text-sm font-medium">
              Admin
            </span>

          </div>

        </div>

      </header>


      <div className="flex min-h-[calc(100vh-80px)]">

        {/* =====================================================
            SIDEBAR
        ===================================================== */}

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
                className="block bg-black px-4 py-3 text-sm text-white"
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


        {/* =====================================================
            MAIN
        ===================================================== */}

        <section className="flex-1 p-6 md:p-10">

          <div className="mx-auto max-w-[1600px]">

            {/* =================================================
                TITLE
            ================================================= */}

            <div>

              <p className="text-xs uppercase tracking-[0.3em] text-black/40">
                AARIZ MANAGEMENT
              </p>

              <h1 className="mt-3 text-4xl font-light">
                Orders
              </h1>

              <p className="mt-3 text-sm text-black/50">
                View and manage customer orders.
              </p>

            </div>


            {/* =================================================
                ORDERS BOX
            ================================================= */}

            <div className="mt-10 border border-black/10 bg-white">

              {/* HEADER */}

              <div className="flex items-center justify-between border-b border-black/10 p-6">

                <div>

                  <h2 className="text-xl font-medium">
                    Customer Orders
                  </h2>

                  <p className="mt-1 text-xs text-black/40">
                    {orders.length} order
                    {orders.length !== 1
                      ? "s"
                      : ""}
                  </p>

                </div>

                <button
                  type="button"
                  onClick={loadOrders}
                  className="border border-black px-4 py-2 text-xs transition hover:bg-black hover:text-white"
                >
                  Refresh
                </button>

              </div>


              {/* =================================================
                  LOADING
              ================================================= */}

              {loading && (

                <div className="p-12 text-center">

                  <p className="text-sm text-black/50">
                    Loading orders...
                  </p>

                </div>

              )}


              {/* =================================================
                  ERROR
              ================================================= */}

              {!loading && error && (

                <div className="p-12 text-center">

                  <p className="text-sm text-red-600">
                    {error}
                  </p>

                  <button
                    type="button"
                    onClick={loadOrders}
                    className="mt-5 bg-black px-5 py-3 text-xs text-white"
                  >
                    Try Again
                  </button>

                </div>

              )}


              {/* =================================================
                  NO ORDERS
              ================================================= */}

              {!loading &&
                !error &&
                orders.length === 0 && (

                  <div className="p-12 text-center">

                    <p className="text-lg font-light">
                      No orders yet.
                    </p>

                    <p className="mt-2 text-sm text-black/40">
                      Customer orders will appear here.
                    </p>

                  </div>

                )}


              {/* =================================================
                  ORDERS TABLE
              ================================================= */}

              {!loading &&
                !error &&
                orders.length > 0 && (

                  <div className="overflow-x-auto">

                    <table className="w-full min-w-[1200px]">

                      {/* TABLE HEADER */}

                      <thead>

                        <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wider text-black/40">

                          <th className="px-6 py-4">
                            Order
                          </th>

                          <th className="px-6 py-4">
                            Customer
                          </th>

                          <th className="px-6 py-4">
                            Phone
                          </th>

                          <th className="px-6 py-4">
                            City
                          </th>

                          <th className="px-6 py-4">
                            Delivery Address
                          </th>

                          <th className="px-6 py-4">
                            Total
                          </th>

                          <th className="px-6 py-4">
                            Status
                          </th>

                          <th className="px-6 py-4">
                            Date
                          </th>

                        </tr>

                      </thead>


                      {/* TABLE BODY */}

                      <tbody>

                        {orders.map(
                          (order) => (

                            <tr
                              key={order.id}
                              className="border-b border-black/5 last:border-0"
                            >

                              {/* ORDER ID */}

                              <td className="px-6 py-5 text-sm font-medium">
                                #{order.id}
                              </td>


                              {/* CUSTOMER */}

                              <td className="px-6 py-5 text-sm">

                                <p className="font-medium">
                                  {order.customer_name}
                                </p>

                              </td>


                              {/* PHONE */}

                              <td className="px-6 py-5 text-sm whitespace-nowrap">
                                {order.phone}
                              </td>


                              {/* CITY */}

                              <td className="px-6 py-5 text-sm">
                                {order.city}
                              </td>


                              {/* =================================================
                                  DELIVERY ADDRESS
                              ================================================= */}

                              <td className="max-w-[300px] px-6 py-5 text-sm">

                                {order.address ? (

                                  <div>

                                    <p className="break-words leading-6 text-black/70">
                                      {order.address}
                                    </p>

                                  </div>

                                ) : (

                                  <p className="text-xs italic text-black/30">
                                    No address provided
                                  </p>

                                )}

                              </td>


                              {/* TOTAL */}

                              <td className="px-6 py-5 text-sm whitespace-nowrap">

                                Rs.{" "}

                                {Number(
                                  order.total
                                ).toLocaleString()}

                              </td>


                              {/* STATUS */}

                              <td className="px-6 py-5">

                                <select
                                  value={
                                    order.status
                                  }
                                  onChange={(e) =>
                                    updateStatus(
                                      order.id,
                                      e.target.value
                                    )
                                  }
                                  className="border border-black/20 bg-white px-3 py-2 text-xs outline-none"
                                >

                                  <option value="pending">
                                    Pending
                                  </option>

                                  <option value="confirmed">
                                    Confirmed
                                  </option>

                                  <option value="shipped">
                                    Shipped
                                  </option>

                                  <option value="delivered">
                                    Delivered
                                  </option>

                                  <option value="cancelled">
                                    Cancelled
                                  </option>

                                </select>

                              </td>


                              {/* DATE */}

                              <td className="px-6 py-5 text-xs whitespace-nowrap text-black/50">

                                {new Date(
                                  order.created_at
                                ).toLocaleDateString()}

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