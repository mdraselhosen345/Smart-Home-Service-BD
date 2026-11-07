import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { auth } from "../../../Firebase/Firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const STATUSES = ["Pending", "Confirmed", "In Progress", "Completed", "Cancelled"];

const statusStyle = (status) => {
  switch (status) {
    case "Confirmed":
      return "bg-blue-100 text-blue-700";
    case "In Progress":
      return "bg-yellow-100 text-yellow-700";
    case "Completed":
      return "bg-green-100 text-green-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const Services = () => {
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCategory, setFilterCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Please log in to your admin account again.");
    return user.getIdToken(true);
  };

  const loadRequests = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/admin/services?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Could not load requests.");
      }
      setRequests(Array.isArray(result.data) ? result.data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();
  }, [loadRequests]);

  const updateStatus = async (id, status) => {
    setError("");
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/admin/services/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.message || "Could not update status.");
      }
      setRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const deleteRequest = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service request?")) {
      return;
    }
    setError("");
    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/admin/services/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "Could not delete.");
      }
      setRequests((prev) => prev.filter((r) => r.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const text = search.toLowerCase();
    const matchesSearch =
      String(request.name || "").toLowerCase().includes(text) ||
      String(request.phone || "").includes(search) ||
      String(request.serviceName || "").toLowerCase().includes(text);

    const matchesStatus =
      filterStatus === "All" || request.status === filterStatus;

    const matchesCategory =
      filterCategory === "All" || request.category === filterCategory;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const completedCount = requests.filter((r) => r.status === "Completed").length;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              Home Service Management
            </h1>
            <p className="mt-2 text-gray-500">
              Manage customer service requests.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={loadRequests}
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
            <p className="text-sm text-gray-500">Total Requests</p>
            <h2 className="mt-2 text-3xl font-bold text-blue-600">
              {requests.length}
            </h2>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Pending Requests</p>
            <h2 className="mt-2 text-3xl font-bold text-yellow-600">
              {pendingCount}
            </h2>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-sm text-gray-500">Completed Services</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {completedCount}
            </h2>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm md:flex-row">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search customer, phone or service..."
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-lg border bg-white p-3 md:w-60"
          >
            <option value="All">All Types</option>
            <option value="Service Center">Service Center</option>
            <option value="Home Service">Home Service</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-lg border bg-white p-3 md:w-60"
          >
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Requests Table */}
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[1100px] text-left">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4">Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Service</th>
                <th className="p-4">Address</th>
                <th className="p-4">Problem</th>
                <th className="p-4">Cost (৳)</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-gray-500">
                    Loading requests...
                  </td>
                </tr>
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((request) => (
                  <tr
                    key={request.id}
                    className="border-b align-top hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap p-4 text-sm text-gray-600">
                      {request.createdAt
                        ? new Date(request.createdAt).toLocaleString()
                        : "N/A"}
                    </td>

                    <td className="p-4">
                      <p className="font-semibold text-gray-800">
                        {request.name || "N/A"}
                      </p>
                      <a
                        href={`tel:${request.phone}`}
                        className="text-sm text-blue-600"
                      >
                        {request.phone || "N/A"}
                      </a>
                      {request.email && (
                        <p className="text-sm text-gray-500">{request.email}</p>
                      )}
                    </td>

                    <td className="p-4 font-medium text-gray-800">
                      {request.serviceName || "N/A"}
                      {request.category && (
                        <span className="mt-1 block text-xs text-orange-600">
                          {request.category}
                        </span>
                      )}
                    </td>

                    <td className="max-w-48 p-4 text-sm">
                      {request.address || "N/A"}
                    </td>

                    <td className="max-w-52 whitespace-pre-wrap p-4 text-sm">
                      {request.message || "N/A"}
                    </td>

                    <td className="p-4 font-semibold">
                      ৳{Number(request.price || 0).toLocaleString("en-BD")}
                    </td>

                    <td className="p-4">
                      <select
                        value={request.status || "Pending"}
                        onChange={(e) =>
                          updateStatus(request.id, e.target.value)
                        }
                        className={`rounded-lg border-0 p-2 text-sm font-semibold ${statusStyle(
                          request.status
                        )}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="p-4">
                      <button
                        type="button"
                        onClick={() => deleteRequest(request.id)}
                        className="rounded-lg bg-red-100 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-200"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-gray-500">
                    {requests.length === 0
                      ? "No service requests found."
                      : "No matching requests found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Showing {filteredRequests.length} of {requests.length} requests
        </p>
      </div>
    </div>
  );
};

export default Services;