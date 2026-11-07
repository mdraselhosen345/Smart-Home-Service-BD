import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router";
import { auth } from "../../../Firebase/Firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AllProduct = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const getToken = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error("Please log in to your admin account again.");
    return user.getIdToken(true);
  };

  // Load products from backend
  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/products?limit=500`);
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || "Could not load products.");
      }
      // supports { data: [...] }, { products: [...] } or a plain array
      const list = Array.isArray(result)
        ? result
        : result.data?.products ||
          result.data?.items ||
          result.data ||
          result.products ||
          result.items ||
          [];
      setProducts(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Load products error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // Delete product from backend
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const token = await getToken();
      const response = await fetch(`${API_URL}/admin/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "Product could not be deleted.");
      }

      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
    } catch (err) {
      console.error("Delete product error:", err);
      setError(err.message);
    }
  };

  const nameOf = (p) => p.title || p.name || "";

  const filteredProducts = products.filter((product) => {
    const matchesSearch = nameOf(product)
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesCategory =
      category === "All" || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              All Products
            </h1>
            <p className="mt-1 text-gray-500">
              Manage all products in your store.
            </p>
          </div>

          <Link
            to="/admin/AddProduct"
            className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            + Add Product
          </Link>
        </div>

        {error && (
          <div className="mb-5 rounded-lg bg-red-100 p-3 text-red-700">
            Error: {error}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Products</p>
          <h2 className="mt-1 text-3xl font-bold text-blue-600">
            {products.length}
          </h2>
        </div>

        {/* Search and Filter */}
        <div className="mb-6 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm md:flex-row">
          <input
            type="text"
            placeholder="Search product by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border bg-white p-3 outline-none focus:border-blue-500 md:w-64"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Categories" : item}
              </option>
            ))}
          </select>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="p-4">Image</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const id = product._id || product.id;
                  return (
                    <tr key={id} className="border-b hover:bg-gray-50">
                      <td className="p-4">
                        <img
                          src={product.image || product.images?.[0]}
                          alt={nameOf(product)}
                          className="h-14 w-14 rounded-lg border object-contain"
                        />
                      </td>

                      <td className="p-4 font-medium text-gray-800">
                        {nameOf(product)}
                      </td>

                      <td className="p-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
                          {product.category}
                        </span>
                      </td>

                      <td className="p-4 font-semibold">
                        ৳{Number(product.price || 0).toLocaleString("en-BD")}
                      </td>

                      <td className="p-4">{product.stock ?? 0}</td>

                      <td className="p-4">
                        <button
                          onClick={() => handleDelete(id)}
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
                  <td colSpan="6" className="p-10 text-center text-gray-500">
                    {products.length === 0
                      ? "No products added yet."
                      : "No matching products found."}

                    <div className="mt-4">
                      <Link
                        to="/admin/AddProduct"
                        className="font-semibold text-blue-600 hover:underline"
                      >
                        Add your first product
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <p className="mt-4 text-sm text-gray-500">
          Showing {filteredProducts.length} of {products.length} products
        </p>
      </div>
    </div>
  );
};

export default AllProduct;