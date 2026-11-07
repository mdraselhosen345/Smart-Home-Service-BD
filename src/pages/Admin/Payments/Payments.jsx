
import React, { useEffect, useState } from "react";
import { Link } from "react-router";

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  // Load payments from saved orders
  useEffect(() => {
    try {
      const orders = JSON.parse(
        localStorage.getItem("orders") || "[]"
      );

      const paymentList = orders.map((order) => ({
        id: order.id,
        customerName: order.name || order.customerName || "N/A",
        phone: order.phone || "N/A",
        amount: Number(
          order.total ??
          order.totalPrice ??
          (Number(order.product?.price || 0) *
            Number(order.quantity || 1))
        ) || 0,
        method:
          order.paymentMethod || order.payment || "Cash on Delivery",
        transactionId:
          order.transactionId || order.trxID || "N/A",
        status: order.paymentStatus || "Pending",
        orderStatus: order.status || "Pending",
      }));

      setPayments(paymentList);
    } catch {
      setPayments([]);
    }
  }, []);

  // Update payment status
  const updatePaymentStatus = (id, newStatus) => {
    const updatedPayments = payments.map((payment) =>
      String(payment.id) === String(id)
        ? { ...payment, status: newStatus }
        : payment
    );

    setPayments(updatedPayments);

    // Keep payment status in the corresponding order
    const orders = JSON.parse(
      localStorage.getItem("orders") || "[]"
    );

    const updatedOrders = orders.map((order) =>
      String(order.id) === String(id)
        ? { ...order, paymentStatus: newStatus }
        : order
    );

    localStorage.setItem("orders", JSON.stringify(updatedOrders));
  };

  // Search and filter
  const filteredPayments = payments.filter((payment) => {
    const query = search.toLowerCase();

    const matchesSearch =
      payment.customerName.toLowerCase().includes(query) ||
      payment.phone.toLowerCase().includes(query) ||
      String(payment.id).toLowerCase().includes(query) ||
      payment.transactionId.toLowerCase().includes(query);

    const matchesStatus =
      filterStatus === "All" || payment.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const paidAmount = payments
    .filter((payment) => payment.status === "Paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingAmount = payments
    .filter((payment) => payment.status === "Pending")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const statusStyle = (status) => {
    if (status === "Paid") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Failed") {
      return "bg-red-100 text-red-700";
    }

    if (status === "Refunded") {
      return "bg-purple-100 text-purple-700";
    }

    return "bg-yellow-100 text-yellow-700";
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              Payments Management
            </h1>
            <p className="mt-2 text-gray-500">
              View customer payments and payment status.
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="rounded-lg bg-gray-800 px-5 py-3 font-semibold text-white hover:bg-gray-700"
          >
            Back to Dashboard
          </Link>
        </div>

        {/* Statistics */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Payments
            </p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {payments.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Paid Amount
            </p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              ৳{paidAmount.toLocaleString("en-BD")}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Pending Amount
            </p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-600">
              ৳{pendingAmount.toLocaleString("en-BD")}
            </h2>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm md:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, phone, order ID or transaction ID..."
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border bg-white p-3 md:w-56"
          >
            <option value="All">All Payment Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Failed">Failed</option>
            <option value="Refunded">Refunded</option>
          </select>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[1050px] text-left">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Method</th>
                <th className="p-4">Transaction ID</th>
                <th className="p-4">Payment Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr
                    key={payment.id}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="p-4 font-semibold">
                      #{payment.id}
                    </td>

                    <td className="p-4">
                      <p className="font-semibold">
                        {payment.customerName}
                      </p>
                      <p className="text-sm text-gray-500">
                        {payment.phone}
                      </p>
                    </td>

                    <td className="p-4 font-semibold">
                      ৳{payment.amount.toLocaleString("en-BD")}
                    </td>

                    <td className="p-4">
                      {payment.method}
                    </td>

                    <td className="p-4">
                      {payment.transactionId}
                    </td>

                    <td className="p-4">
                      <select
                        value={payment.status}
                        onChange={(e) =>
                          updatePaymentStatus(
                            payment.id,
                            e.target.value
                          )
                        }
                        className={`rounded-lg border-0 p-2 text-sm font-semibold ${statusStyle(payment.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Paid">Paid</option>
                        <option value="Failed">Failed</option>
                        <option value="Refunded">Refunded</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="p-10 text-center text-gray-500"
                  >
                    {payments.length === 0
                      ? "No payment records found."
                      : "No matching payments found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Showing {filteredPayments.length} of {payments.length} payments
        </p>
      </div>
    </div>
  );
};

export default Payments;