// import React, { useCallback, useEffect, useState } from "react";
// import { Link } from "react-router";
// import { auth } from "../../../Firebase/Firebase";

// const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// // backend-এর মান না মিললে এই তালিকা বদলান
// const ORDER_STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

// const statusClass = (s) => {
//   switch (s) {
//     case "Confirmed":
//       return "bg-blue-100 text-blue-700";
//     case "Processing":
//     case "Shipped":
//       return "bg-yellow-100 text-yellow-700";
//     case "Delivered":
//     case "Paid":
//       return "bg-green-100 text-green-700";
//     case "Cancelled":
//     case "Failed":
//       return "bg-red-100 text-red-700";
//     case "Refunded":
//       return "bg-purple-100 text-purple-700";
//     default:
//       return "bg-gray-100 text-gray-700";
//   }
// };

// const Orders = () => {
//   const [orders, setOrders] = useState([]);
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   const getToken = async () => {
//     const user = auth.currentUser;
//     if (!user) throw new Error("Please log in to your admin account again.");
//     return user.getIdToken(true);
//   };

//   const call = async (path, options = {}) => {
//     const token = await getToken();
//     const response = await fetch(`${API_URL}${path}`, {
//       ...options,
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     });
//     const result = await response.json().catch(() => ({}));
//     if (!response.ok) {
//       const detail = Array.isArray(result.details)
//         ? result.details.map((d) => `${d.field}: ${d.message}`).join(", ")
//         : "";
//       throw new Error(`${result.message || "Request failed"}${detail ? ` (${detail})` : ""}`);
//     }
//     return result;
//   };

//   const loadOrders = useCallback(async () => {
//     setLoading(true);
//     setError("");
//     try {
//       const result = await call("/admin/orders?limit=100");
//       setOrders(Array.isArray(result.data) ? result.data : []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     loadOrders();
//   }, [loadOrders]);

//   const idOf = (o) => o.id || o._id;

//   const updateOrder = async (order, path, body, patch) => {
//     setError("");
//     try {
//       await call(`/admin/orders/${idOf(order)}${path}`, {
//         method: "PATCH",
//         body: JSON.stringify(body),
//       });
//       setOrders((prev) =>
//         prev.map((o) => (idOf(o) === idOf(order) ? { ...o, ...patch } : o))
//       );
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const changeStatus = (order, status) =>
//     updateOrder(order, "/status", { status }, { status });

//   const changePayment = (order, paymentStatus) =>
//     updateOrder(order, "/payment", { paymentStatus }, { paymentStatus });

//   const handleDelete = async (order) => {
//     if (!window.confirm("Are you sure you want to delete this order?")) return;
//     setError("");
//     try {
//       await call(`/admin/orders/${idOf(order)}`, { method: "DELETE" });
//       setOrders((prev) => prev.filter((o) => idOf(o) !== idOf(order)));
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const filteredOrders = orders.filter((order) => {
//     const text = search.toLowerCase();
//     const matchesSearch =
//       String(order.name || "").toLowerCase().includes(text) ||
//       String(order.phone || "").includes(search) ||
//       String(order.orderNo || order.id || "").toLowerCase().includes(text) ||
//       String(order.trxID || "").toLowerCase().includes(text);
//     const matchesStatus =
//       statusFilter === "All" || (order.status || "Pending") === statusFilter;
//     return matchesSearch && matchesStatus;
//   });

//   const totalOf = (o) => Number(o.total ?? o.totalPrice ?? o.grandTotal ?? 0) || 0;

//   const itemsText = (o) =>
//     Array.isArray(o.items)
//       ? o.items
//           .map((i) => `${i.title || i.name || "Product"} × ${i.quantity}`)
//           .join(", ")
//       : "Product order";

//   const pendingCount = orders.filter((o) => (o.status || "Pending") === "Pending").length;
//   const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 md:p-8">
//       <div className="mx-auto max-w-7xl">
//         {/* Header */}
//         <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
//               Order Management
//             </h1>
//             <p className="mt-1 text-gray-500">View and manage customer orders.</p>
//           </div>
//           <div className="flex gap-3">
//             <button
//               type="button"
//               onClick={loadOrders}
//               className="rounded-lg bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
//             >
//               Refresh
//             </button>
//             <Link
//               to="/admin/dashboard"
//               className="rounded-lg bg-gray-800 px-4 py-3 text-white hover:bg-gray-700"
//             >
//               Back to Dashboard
//             </Link>
//           </div>
//         </div>

//         {error && (
//           <div className="mb-5 rounded-lg bg-red-100 p-3 text-red-700">
//             Error: {error}
//           </div>
//         )}

//         {/* Statistics */}
//         <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
//           <div className="rounded-xl bg-white p-5 shadow-sm">
//             <p className="text-gray-500">Total Orders</p>
//             <h2 className="mt-2 text-3xl font-bold text-blue-600">{orders.length}</h2>
//           </div>
//           <div className="rounded-xl bg-white p-5 shadow-sm">
//             <p className="text-gray-500">Pending Orders</p>
//             <h2 className="mt-2 text-3xl font-bold text-yellow-600">{pendingCount}</h2>
//           </div>
//           <div className="rounded-xl bg-white p-5 shadow-sm">
//             <p className="text-gray-500">Delivered Orders</p>
//             <h2 className="mt-2 text-3xl font-bold text-green-600">{deliveredCount}</h2>
//           </div>
//         </div>

//         {/* Search and Filter */}
//         <div className="mb-6 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm md:flex-row">
//           <input
//             type="text"
//             placeholder="Search name, phone, order no or TrxID..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
//           />
//           <select
//             value={statusFilter}
//             onChange={(e) => setStatusFilter(e.target.value)}
//             className="rounded-lg border bg-white p-3 md:w-56"
//           >
//             <option value="All">All Statuses</option>
//             {ORDER_STATUSES.map((s) => (
//               <option key={s} value={s}>
//                 {s}
//               </option>
//             ))}
//           </select>
//         </div>

//         {/* Orders Table */}
//         <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
//           <table className="w-full min-w-[1200px] text-left">
//             <thead className="bg-gray-800 text-white">
//               <tr>
//                 <th className="p-4">Order</th>
//                 <th className="p-4">Customer</th>
//                 <th className="p-4">Product</th>
//                 <th className="p-4">Total</th>
//                 <th className="p-4">Payment</th>
//                 <th className="p-4">Status</th>
//                 <th className="p-4">Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan="7" className="p-10 text-center text-gray-500">
//                     Loading orders...
//                   </td>
//                 </tr>
//               ) : filteredOrders.length > 0 ? (
//                 filteredOrders.map((order) => {
//                   const status = order.status || "Pending";
//                   const pay = order.paymentStatus || "Pending";
//                   const isBkash = String(order.paymentMethod || "")
//                     .toLowerCase()
//                     .includes("bkash");

//                   return (
//                     <tr key={idOf(order)} className="border-b align-top hover:bg-gray-50">
//                       <td className="p-4">
//                         <p className="font-semibold">
//                           #{order.orderNo || String(idOf(order)).slice(-6)}
//                         </p>
//                         <p className="text-xs text-gray-500">
//                           {order.createdAt
//                             ? new Date(order.createdAt).toLocaleString()
//                             : ""}
//                         </p>
//                       </td>

//                       <td className="p-4">
//                         <p className="font-medium">{order.name || "N/A"}</p>
//                         <a href={`tel:${order.phone}`} className="text-sm text-blue-600">
//                           {order.phone || "No phone"}
//                         </a>
//                         <p className="max-w-48 text-sm text-gray-500">
//                           {order.address || ""}
//                         </p>
//                       </td>

//                       <td className="max-w-56 p-4 text-sm">{itemsText(order)}</td>

//                       <td className="p-4 font-semibold">
//                         ৳{totalOf(order).toLocaleString("en-BD")}
//                       </td>

//                       <td className="p-4">
//                         <p className="text-sm font-medium">
//                           {order.paymentMethod || "Cash on Delivery"}
//                         </p>
//                         {isBkash && order.trxID && (
//                           <p className="mt-1 break-all rounded bg-pink-50 px-2 py-1 text-xs font-bold text-pink-700">
//                             TrxID: {order.trxID}
//                           </p>
//                         )}
//                         <span
//                           className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-semibold ${statusClass(pay)}`}
//                         >
//                           {pay}
//                         </span>
//                         {isBkash && (
//                           <div className="mt-2 flex gap-2">
//                             <button
//                               type="button"
//                               onClick={() => changePayment(order, "Paid")}
//                               className="rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white hover:bg-green-700"
//                             >
//                               Paid
//                             </button>
//                             <button
//                               type="button"
//                               onClick={() => changePayment(order, "Failed")}
//                               className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700"
//                             >
//                               Failed
//                             </button>
//                           </div>
//                         )}
//                       </td>

//                       <td className="p-4">
//                         <select
//                           value={status}
//                           onChange={(e) => changeStatus(order, e.target.value)}
//                           className={`rounded-lg border-0 p-2 text-sm font-semibold ${statusClass(status)}`}
//                         >
//                           {ORDER_STATUSES.map((s) => (
//                             <option key={s} value={s}>
//                               {s}
//                             </option>
//                           ))}
//                         </select>
//                       </td>

//                       <td className="p-4">
//                         <button
//                           type="button"
//                           onClick={() => handleDelete(order)}
//                           className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-200"
//                         >
//                           Delete
//                         </button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="7" className="p-10 text-center text-gray-500">
//                     {orders.length === 0
//                       ? "No orders found yet."
//                       : "No matching orders found."}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         <p className="mt-4 text-sm text-gray-500">
//           Showing {filteredOrders.length} of {orders.length} orders
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Orders;


import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { auth } from "../../../Firebase/Firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// backend-এর মান না মিললে এই তালিকা বদলান
const ORDER_STATUSES = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled"];

const statusClass = (s) => {
  switch (s) {
    case "Confirmed":
      return "bg-blue-100 text-blue-700";
    case "Processing":
    case "Shipped":
      return "bg-yellow-100 text-yellow-700";
    case "Delivered":
    case "Paid":
      return "bg-green-100 text-green-700";
    case "Cancelled":
    case "Failed":
      return "bg-red-100 text-red-700";
    case "Refunded":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// আইটেমের ছবি, নাম ও আইডি বের করার হেল্পার (backend-এর ফিল্ডের নাম আলাদা হলে এখানে যোগ করুন)
const itemImage = (i) =>
  i.image || i.img || i.imageUrl || i.thumbnail || i.photo || i.product?.image || "";

const itemName = (i) => i.title || i.name || i.product?.title || i.product?.name || "Product";

const itemPrice = (i) => i.price ?? i.product?.price;

const itemProductId = (i) => {
  const id = i.productId || i.product?._id || i.product?.id || i.product;
  return typeof id === "string" ? id : "";
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Please log in to your admin account again.");
    return user.getIdToken(true);
  };

  const call = async (path, options = {}) => {
    const token = await getToken();
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      const detail = Array.isArray(result.details)
        ? result.details.map((d) => `${d.field}: ${d.message}`).join(", ")
        : "";
      throw new Error(`${result.message || "Request failed"}${detail ? ` (${detail})` : ""}`);
    }
    return result;
  };

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await call("/admin/orders?limit=100");
      setOrders(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const idOf = (o) => o.id || o._id;

  const updateOrder = async (order, path, body, patch) => {
    setError("");
    try {
      await call(`/admin/orders/${idOf(order)}${path}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      setOrders((prev) =>
        prev.map((o) => (idOf(o) === idOf(order) ? { ...o, ...patch } : o))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const changeStatus = (order, status) =>
    updateOrder(order, "/status", { status }, { status });

  const changePayment = (order, paymentStatus) =>
    updateOrder(order, "/payment", { paymentStatus }, { paymentStatus });

  const handleDelete = async (order) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    setError("");
    try {
      await call(`/admin/orders/${idOf(order)}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((o) => idOf(o) !== idOf(order)));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const text = search.toLowerCase();
    const itemNames = Array.isArray(order.items)
      ? order.items.map((i) => itemName(i)).join(" ").toLowerCase()
      : "";
    const matchesSearch =
      String(order.name || "").toLowerCase().includes(text) ||
      String(order.phone || "").includes(search) ||
      String(order.orderNo || order.id || "").toLowerCase().includes(text) ||
      String(order.trxID || "").toLowerCase().includes(text) ||
      itemNames.includes(text);
    const matchesStatus =
      statusFilter === "All" || (order.status || "Pending") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOf = (o) => Number(o.total ?? o.totalPrice ?? o.grandTotal ?? 0) || 0;

  const pendingCount = orders.filter((o) => (o.status || "Pending") === "Pending").length;
  const deliveredCount = orders.filter((o) => o.status === "Delivered").length;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              Order Management
            </h1>
            <p className="mt-1 text-gray-500">View and manage customer orders.</p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadOrders}
              className="rounded-lg bg-white px-4 py-3 font-semibold text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Refresh
            </button>
            <Link
              to="/admin/dashboard"
              className="rounded-lg bg-gray-800 px-4 py-3 text-white hover:bg-gray-700"
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
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-gray-500">Total Orders</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">{orders.length}</h2>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-gray-500">Pending Orders</p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-600">{pendingCount}</h2>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-gray-500">Delivered Orders</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">{deliveredCount}</h2>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm md:flex-row">
          <input
            type="text"
            placeholder="Search name, phone, order no, product or TrxID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border bg-white p-3 md:w-56"
          >
            <option value="All">All Statuses</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[1200px] text-left">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4">Order</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Product</th>
                <th className="p-4">Total</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-gray-500">
                    Loading orders...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const status = order.status || "Pending";
                  const pay = order.paymentStatus || "Pending";
                  const isBkash = String(order.paymentMethod || "")
                    .toLowerCase()
                    .includes("bkash");

                  return (
                    <tr key={idOf(order)} className="border-b align-top hover:bg-gray-50">
                      <td className="p-4">
                        <p className="font-semibold">
                          #{order.orderNo || String(idOf(order)).slice(-6)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleString()
                            : ""}
                        </p>
                      </td>

                      <td className="p-4">
                        <p className="font-medium">{order.name || "N/A"}</p>
                        <a href={`tel:${order.phone}`} className="text-sm text-blue-600">
                          {order.phone || "No phone"}
                        </a>
                        <p className="max-w-48 text-sm text-gray-500">
                          {order.address || ""}
                        </p>
                      </td>

                      {/* Product: ছবি + নাম + পরিমাণ + দাম */}
                      <td className="max-w-72 p-4 text-sm">
                        {Array.isArray(order.items) && order.items.length > 0 ? (
                          <div className="space-y-3">
                            {order.items.map((item, idx) => {
                              const img = itemImage(item);
                              const price = itemPrice(item);
                              const pid = itemProductId(item);
                              return (
                                <div key={idx} className="flex items-center gap-3">
                                  {img ? (
                                    <img
                                      src={img}
                                      alt={itemName(item)}
                                      className="h-14 w-14 shrink-0 rounded border object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded border bg-gray-100 text-xs text-gray-400">
                                      No img
                                    </div>
                                  )}
                                  <div className="min-w-0">
                                    <p className="font-medium text-gray-800">
                                      {itemName(item)}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      Qty: {item.quantity ?? 1}
                                      {price != null && price !== ""
                                        ? ` · ৳${Number(price).toLocaleString("en-BD")}`
                                        : ""}
                                    </p>
                                    {pid && (
                                      <p className="text-xs text-gray-400">
                                        ID: {pid.slice(-6)}
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          "Product order"
                        )}
                      </td>

                      <td className="p-4 font-semibold">
                        ৳{totalOf(order).toLocaleString("en-BD")}
                      </td>

                      <td className="p-4">
                        <p className="text-sm font-medium">
                          {order.paymentMethod || "Cash on Delivery"}
                        </p>
                        {isBkash && order.trxID && (
                          <p className="mt-1 break-all rounded bg-pink-50 px-2 py-1 text-xs font-bold text-pink-700">
                            TrxID: {order.trxID}
                          </p>
                        )}
                        <span
                          className={`mt-2 inline-block rounded-full px-2 py-1 text-xs font-semibold ${statusClass(pay)}`}
                        >
                          {pay}
                        </span>
                        {isBkash && (
                          <div className="mt-2 flex gap-2">
                            <button
                              type="button"
                              onClick={() => changePayment(order, "Paid")}
                              className="rounded bg-green-600 px-2 py-1 text-xs font-semibold text-white hover:bg-green-700"
                            >
                              Paid
                            </button>
                            <button
                              type="button"
                              onClick={() => changePayment(order, "Failed")}
                              className="rounded bg-red-600 px-2 py-1 text-xs font-semibold text-white hover:bg-red-700"
                            >
                              Failed
                            </button>
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        <select
                          value={status}
                          onChange={(e) => changeStatus(order, e.target.value)}
                          className={`rounded-lg border-0 p-2 text-sm font-semibold ${statusClass(status)}`}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-4">
                        <button
                          type="button"
                          onClick={() => handleDelete(order)}
                          className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="p-10 text-center text-gray-500">
                    {orders.length === 0
                      ? "No orders found yet."
                      : "No matching orders found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Showing {filteredOrders.length} of {orders.length} orders
        </p>
      </div>
    </div>
  );
};

export default Orders;
