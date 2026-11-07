import React, { useState } from "react";
import { Link } from "react-router";
import { auth } from "../../../Firebase/Firebase";

const emptyProduct = {
  name: "",
  category: "",
  price: "",
  oldPrice: "",
  image: "",
  description: "",
  stock: "",
};

const AddProduct = () => {
  const [product, setProduct] = useState(emptyProduct);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const user = auth.currentUser;
      if (!user) {
        setMessage("Error: Please log in to your admin account again.");
        return;
      }

      const priceNumber = Number(String(product.price).replace(/,/g, ""));
      if (Number.isNaN(priceNumber)) {
        setMessage("Error: Price must be a valid number (English digits only).");
        return;
      }

      const token = await user.getIdToken(true);

      const imageUrl = product.image.trim();

      const newProduct = {
        title: product.name.trim(),
        category: product.category,
        price: priceNumber,
        oldPrice: Number(product.oldPrice || 0),
        thumbnail: imageUrl,
        images: imageUrl ? [imageUrl] : [],
        description: product.description.trim(),
        stock: Number(product.stock),
      };

      const API_URL =
        import.meta.env.VITE_API_URL || "http://localhost:5000/api";

      const response = await fetch(`${API_URL}/admin/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newProduct),
      });

      const result = await response.json();

      if (!response.ok) {
        const detail = Array.isArray(result.details)
          ? result.details.map((d) => `${d.field}: ${d.message}`).join(", ")
          : "";
        throw new Error(
          `${result.message || result.error || "Product could not be saved."}${
            detail ? ` (${detail})` : ""
          }`
        );
      }

      setMessage("Product successfully saved to the backend!");
      setProduct(emptyProduct);
    } catch (error) {
      console.error("Add product error:", error);
      setMessage(`Error: ${error.message}`);
    }
  };

  const isError = message.startsWith("Error");

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">
              Add New Product
            </h1>
            <p className="mt-1 text-gray-500">
              Add a new product to your store.
            </p>
          </div>

          <Link
            to="/admin/dashboard"
            className="rounded-lg bg-gray-800 px-4 py-2 text-white hover:bg-gray-700"
          >
            Back to Dashboard
          </Link>
        </div>

        {message && (
          <div
            className={`mb-5 rounded-lg p-3 ${
              isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
            }`}
          >
            {message}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl bg-white p-5 shadow-md md:p-8"
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block font-semibold">Product Name *</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">Category *</label>
              <select
                name="category"
                value={product.category}
                onChange={handleChange}
                className="w-full rounded-lg border bg-white p-3 outline-none focus:border-blue-500"
                required
              >
                <option value="">Select Category</option>
                <option value="Electronic">Electronic Products</option>
                <option value="Accessories">Computer Accessories</option>
                <option value="Modern">Modern Products</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Selling Price (৳) *
              </label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter selling price"
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">Old Price (৳)</label>
              <input
                type="number"
                name="oldPrice"
                value={product.oldPrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="Enter old price"
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Product Image URL *
              </label>
              <input
                type="url"
                name="image"
                value={product.image}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="mb-2 block font-semibold">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleChange}
                min="0"
                step="1"
                placeholder="Enter stock quantity"
                className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                required
              />
            </div>
          </div>

          {product.image && (
            <div>
              <p className="mb-2 font-semibold">Image Preview</p>
              <img
                src={product.image}
                alt="Product preview"
                referrerPolicy="no-referrer"
                className="h-40 w-40 rounded-xl border object-contain"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block font-semibold">
              Product Description *
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleChange}
              placeholder="Write product details..."
              rows="4"
              className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700"
          >
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;