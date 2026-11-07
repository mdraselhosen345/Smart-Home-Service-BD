import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { auth } from "../../../Firebase/Firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Customers = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Please log in to your admin account again.");
      const token = await user.getIdToken(true);
      const response = await fetch(`${API_URL}/admin/orders?limit=500`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || "Could not load orders.");
      }
      setOrders(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // wait for Firebase to restore the login after a page reload
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) loadOrders();
      else setLoading(false);
    });
    return () => unsubscribe();
  }, [loadOrders]);

  // Build customers from orders (phone is the unique key)
  const customers = useMemo(() => {
    const map = new Map();

    orders.forEach((order) => {
      const name = String(order.name || "").trim();
      const phone = String(order.phone || "").trim();
      const email = String(order.email || "").trim();
      const address = String(order.address || "").trim();

      const key = phone || email || name;
      if (!key) return;

      if (!map.has(key)) {
        map.set(key, {
          id: key,
          name: name || "N/A",
          phone: phone || "N/A",
          email: email || "N/A",
          address: address || "N/A",
          totalOrders: 0,
          totalSpent: 0,
          lastOrder: null,
        });
      }

      const customer = map.get(key);
      customer.totalOrders += 1;
      customer.totalSpent +=
        Number(order.total ?? order.totalPrice ?? order.grandTotal ?? 0) || 0;

      const date = order.createdAt ? new Date(order.createdAt) : null;
      if (date && (!customer.lastOrder || date > customer.lastOrder)) {
        customer.lastOrder = date;
        // newest order's details win
        if (name) customer.name = name;
        if (email) customer.email = email;
        if (address) customer.address = address;
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => (b.lastOrder || 0) - (a.lastOrder || 0)
    );
  }, [orders]);

  const filteredCustomers = customers.filter((customer) => {
    const query = search.toLowerCase();
    return (
      customer.name.toLowerCase().includes(query) ||
      customer.phone.toLowerCase().includes(query) ||
      customer.email.toLowerCase().includes(query) ||
      customer.address.toLowerCase().includes(query)
    );
  });

  const totalOrders = customers.reduce((sum, c) => sum + c.totalOrders, 0);
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              Customers
            </h1>
            <p className="mt-2 text-gray-500">
              Customers who have placed orders in your store.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadOrders}
              className="rounded-lg bg-white px-5 py-3 font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Refresh
            </button>
            <Link
              to="/admin/dashboard"
              className="rounded-lg bg-gray-800 px-5 py-3 font-semibold text-white hover:bg-gray-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 p-3 text-red-700">
            Error: {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Customers</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {customers.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Orders</p>
            <h2 className="mt-2 text-3xl font-bold text-purple-600">
              {totalOrders}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Total Order Value</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              ৳{totalSpent.toLocaleString("en-BD")}
            </h2>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer name, phone, email or address..."
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />
        </div>

        {/* Customer Table */}
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Email</th>
                <th className="p-4">Address</th>
                <th className="p-4">Orders</th>
                <th className="p-4">Order Value</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    Loading customers...
                  </td>
                </tr>
              ) : filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">
                          {customer.name}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <a href={`tel:${customer.phone}`} className="text-blue-600">
                        {customer.phone}
                      </a>
                    </td>

                    <td className="p-4">{customer.email}</td>

                    <td className="max-w-56 p-4 text-sm text-gray-600">
                      {customer.address}
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-blue-100 px-3 py-1 font-semibold text-blue-700">
                        {customer.totalOrders}
                      </span>
                    </td>

                    <td className="p-4 font-semibold text-green-700">
                      ৳{customer.totalSpent.toLocaleString("en-BD")}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    {customers.length === 0
                      ? "No customers found. Customers will appear after orders are placed."
                      : "No matching customers found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Showing {filteredCustomers.length} of {customers.length} customers
        </p>
      </div>
    </div>
  );
};

export default Customers;