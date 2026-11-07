import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Link } from "react-router";
import { auth } from "../../../Firebase/Firebase";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const Complaint = () => {
  const [complaints, setComplaints] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Load Complaints from Backend
  const loadComplaints = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const user = auth.currentUser;

      if (!user) {
        throw new Error("Please log in to your admin account again.");
      }

      const token = await user.getIdToken(true);

      const response = await fetch(
        `${API_URL}/admin/complaints?limit=500`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Could not load complaints."
        );
      }

      setComplaints(
        Array.isArray(result.data) ? result.data : []
      );
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Firebase Authentication
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        loadComplaints();
      } else {
        setLoading(false);
        setError("Please log in to your admin account.");
      }
    });

    return () => unsubscribe();
  }, [loadComplaints]);

  // Update Complaint Status
  const updateStatus = async (complaint, newStatus) => {
    const id = complaint._id || complaint.id;

    if (!id) {
      setError("Complaint ID is missing.");
      return;
    }

    try {
      setUpdatingId(id);
      setError("");

      const user = auth.currentUser;

      if (!user) {
        throw new Error("Please log in again.");
      }

      const token = await user.getIdToken(true);

      const response = await fetch(
        `${API_URL}/admin/complaints/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          result.message || "Could not update complaint status."
        );
      }

      setComplaints((previous) =>
        previous.map((item) =>
          (item._id || item.id) === id
            ? { ...item, status: newStatus }
            : item
        )
      );

      setSelectedComplaint((previous) =>
        previous &&
        (previous._id || previous.id) === id
          ? { ...previous, status: newStatus }
          : previous
      );
    } catch (err) {
      setError(err.message || "Status update failed.");
    } finally {
      setUpdatingId(null);
    }
  };

  // Search and Filter
  const filteredComplaints = useMemo(() => {
    return complaints.filter((item) => {
      const name = String(item.name || "").toLowerCase();
      const phone = String(item.phone || "").toLowerCase();
      const email = String(item.email || "").toLowerCase();
      const service = String(
        item.service || item.serviceType || ""
      ).toLowerCase();

      const query = search.toLowerCase();

      const matchesSearch =
        name.includes(query) ||
        phone.includes(query) ||
        email.includes(query) ||
        service.includes(query);

      const status = String(item.status || "Pending");

      const matchesFilter =
        filter === "All" || status === filter;

      return matchesSearch && matchesFilter;
    });
  }, [complaints, search, filter]);

  // Statistics
  const stats = useMemo(() => {
    return {
      total: complaints.length,
      pending: complaints.filter(
        (item) => item.status === "Pending"
      ).length,
      processing: complaints.filter(
        (item) => item.status === "Processing"
      ).length,
      completed: complaints.filter(
        (item) => item.status === "Completed"
      ).length,
    };
  }, [complaints]);

  // Date Format
  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) return "N/A";

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Status Colors
  const statusStyle = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-700";

      case "Processing":
        return "bg-blue-100 text-blue-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  const statCards = [
    {
      title: "Total Complaints",
      value: stats.total,
      icon: "📋",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: "⏳",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: "Processing",
      value: stats.processing,
      icon: "🔧",
      color: "text-indigo-600",
      bg: "bg-indigo-100",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: "✅",
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">

      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">

          <div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              Customer Complaints
            </h1>

            <p className="mt-2 text-gray-500">
              Manage all customer complaints and service requests.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">

            <button
              type="button"
              onClick={loadComplaints}
              disabled={loading}
              className="rounded-lg bg-white px-5 py-3 font-semibold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50"
            >
              {loading ? "Loading..." : "↻ Refresh"}
            </button>

            <Link
              to="/admin/dashboard"
              className="rounded-lg bg-gray-800 px-5 py-3 font-semibold text-white hover:bg-gray-700"
            >
              ← Dashboard
            </Link>

          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 flex items-center justify-between gap-3 rounded-lg bg-red-100 p-4 text-red-700">
            <span>{error}</span>

            <button
              onClick={() => setError("")}
              className="font-bold text-xl"
            >
              ×
            </button>
          </div>
        )}

        {/* Statistics */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {statCards.map((item, index) => (
            <div
              key={index}
              className="rounded-xl bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-gray-500">
                    {item.title}
                  </p>

                  <h2 className={`mt-2 text-3xl font-bold ${item.color}`}>
                    {item.value}
                  </h2>
                </div>

                <div className={`rounded-xl p-4 text-2xl ${item.bg}`}>
                  {item.icon}
                </div>

              </div>
            </div>
          ))}

        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white p-5 shadow-sm md:flex-row">

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, email or service..."
            className="flex-1 rounded-lg border border-gray-300 p-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          >
            <option value="All">All Complaints</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

        </div>

        {/* Complaints Table */}
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">

          <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">

            <div>
              <h2 className="text-xl font-bold text-gray-800">
                All Complaints
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage customer service requests.
              </p>
            </div>

            <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              {filteredComplaints.length} Complaints
            </span>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[1100px] text-left">

              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Service</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody>

                {loading ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="p-10 text-center text-gray-500"
                    >
                      Loading complaints...
                    </td>
                  </tr>

                ) : filteredComplaints.length > 0 ? (

                  filteredComplaints.map((item) => (

                    <tr
                      key={item._id || item.id}
                      className="border-b transition hover:bg-gray-50"
                    >

                      {/* Customer */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                            {String(item.name || "N").charAt(0).toUpperCase()}
                          </div>

                          <div>
                            <p className="font-semibold text-gray-800">
                              {item.name || "N/A"}
                            </p>

                            <p className="text-xs text-gray-500">
                              {item.email || "N/A"}
                            </p>
                          </div>

                        </div>
                      </td>

                      {/* Phone */}
                      <td className="p-4">
                        <a
                          href={`tel:${item.phone || ""}`}
                          className="text-blue-600 hover:underline"
                        >
                          {item.phone || "N/A"}
                        </a>
                      </td>

                      {/* Service */}
                      <td className="p-4 font-medium text-gray-700">
                        {item.service || item.serviceType || "N/A"}
                      </td>

                      {/* Date */}
                      <td className="p-4 text-gray-600">
                        {formatDate(item.createdAt)}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyle(item.status)}`}
                        >
                          {item.status || "Pending"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="p-4">

                        <button
                          type="button"
                          onClick={() => setSelectedComplaint(item)}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                        >
                          View Details
                        </button>

                      </td>

                    </tr>

                  ))

                ) : (

                  <tr>
                    <td
                      colSpan="6"
                      className="p-10 text-center text-gray-500"
                    >
                      {complaints.length === 0
                        ? "No complaints found. Customer complaints will appear here."
                        : "No matching complaints found."}
                    </td>
                  </tr>

                )}

              </tbody>

            </table>

          </div>

        </div>

        {/* Footer */}
        <p className="mt-4 text-sm text-gray-500">
          Showing {filteredComplaints.length} of {complaints.length} complaints
        </p>

      </div>

      {/* Complaint Details Modal */}
      {selectedComplaint && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">

            {/* Modal Header */}
            <div className="mb-6 flex items-center justify-between">

              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  Complaint Details
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Customer service information
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedComplaint(null)}
                className="text-3xl text-gray-400 hover:text-red-500"
              >
                ×
              </button>

            </div>

            {/* Customer Information */}
            <div className="space-y-4">

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Customer Name</p>
                <p className="mt-1 font-semibold text-gray-800">
                  {selectedComplaint.name || "N/A"}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="mt-1 font-medium">
                    {selectedComplaint.phone || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="mt-1 break-all font-medium">
                    {selectedComplaint.email || "N/A"}
                  </p>
                </div>

              </div>

              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="mt-1 font-medium">
                  {selectedComplaint.address || "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Service Type</p>
                <p className="mt-1 font-semibold text-blue-600">
                  {selectedComplaint.service ||
                    selectedComplaint.serviceType ||
                    "N/A"}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Complaint Message</p>
                <div className="mt-2 rounded-lg bg-gray-50 p-4 text-gray-700">
                  {selectedComplaint.message ||
                    selectedComplaint.description ||
                    selectedComplaint.issue ||
                    "No description provided."}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500">Complaint Date</p>
                <p className="mt-1 font-medium">
                  {formatDate(selectedComplaint.createdAt)}
                </p>
              </div>

              {/* Update Status */}
              <div className="border-t pt-5">

                <label className="mb-2 block font-semibold text-gray-800">
                  Update Complaint Status
                </label>

                <select
                  value={selectedComplaint.status || "Pending"}
                  disabled={
                    updatingId ===
                    (selectedComplaint._id || selectedComplaint.id)
                  }
                  onChange={(e) =>
                    updateStatus(selectedComplaint, e.target.value)
                  }
                  className="w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-blue-500 disabled:opacity-50"
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                {updatingId ===
                  (selectedComplaint._id || selectedComplaint.id) && (
                  <p className="mt-2 text-sm text-blue-600">
                    Updating status...
                  </p>
                )}

              </div>

            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedComplaint(null)}
              className="mt-6 w-full rounded-lg bg-gray-800 py-3 font-semibold text-white hover:bg-gray-700"
            >
              Close
            </button>

          </div>

        </div>

      )}

    </div>
  );
};

export default Complaint;
