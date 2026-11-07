import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";

// ====== এখানে মান ঠিক করুন ======
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const BKASH_NUMBER = "01782299570"; // <-- আপনার bKash নম্বর বসান
const PAY_COD = "Cash on Delivery";
const PAY_BKASH = "bKash"; // backend অন্য নাম চাইলে এটা বদলান
// ==================================

const emptyOrder = {
  name: "",
  phone: "",
  email: "",
  address: "",
  note: "",
  quantity: 1,
  paymentMethod: PAY_COD,
  trxID: "",
};

const Checkout = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [order, setOrder] = useState(emptyOrder);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  useEffect(() => {
    const controller = new AbortController();

    const loadProduct = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const response = await fetch(`${API_BASE}/products`, {
          signal: controller.signal,
        });
        if (!response.ok) throw new Error("Product load failed");
        const result = await response.json();
        if (!Array.isArray(result.data)) throw new Error("Invalid data");

        const found = result.data.find(
          (item) => String(item._id || item.id) === String(id)
        );
        if (!found) {
          setLoadError("এই প্রোডাক্টটি পাওয়া যায়নি।");
          return;
        }
        setProduct(found);
      } catch (err) {
        if (err.name !== "AbortError") {
          setLoadError("প্রোডাক্ট লোড করা যাচ্ছে না। Backend পরীক্ষা করুন।");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadProduct();
    return () => controller.abort();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrder((prev) => ({ ...prev, [name]: value }));
  };

  const isBkash = order.paymentMethod === PAY_BKASH;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });

    if (isBkash && !order.trxID.trim()) {
      setStatus({ type: "error", text: "bKash-এ টাকা পাঠানোর পর TrxID লিখুন।" });
      return;
    }

    setSending(true);
    try {
      const response = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: order.name.trim(),
          phone: order.phone.trim(),
          email: order.email.trim(),
          address: order.address.trim(),
          note: order.note.trim(),
          items: [
            {
              productId: String(product._id || product.id),
              quantity: Number(order.quantity) || 1,
            },
          ],
          paymentMethod: order.paymentMethod,
          trxID: isBkash ? order.trxID.trim() : "",
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const detail = Array.isArray(result.details)
          ? result.details.map((d) => `${d.field}: ${d.message}`).join(", ")
          : "";
        throw new Error(
          `${result.message || "অর্ডার পাঠানো যায়নি।"}${detail ? ` (${detail})` : ""}`
        );
      }

      const orderNo = result.data?.orderNo || result.data?.id || "";
      setStatus({
        type: "success",
        text: `অর্ডার সফল হয়েছে!${orderNo ? ` অর্ডার নম্বর: ${orderNo}` : ""} আমরা শীঘ্রই যোগাযোগ করব।`,
      });
      setOrder(emptyOrder);
    } catch (err) {
      setStatus({ type: "error", text: `Error: ${err.message}` });
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-2xl font-bold">লোড হচ্ছে...</h1>
      </div>
    );
  }

  if (loadError || !product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-xl font-bold text-red-600">
          {loadError || "প্রোডাক্ট পাওয়া যায়নি।"}
        </h1>
        <Link to="/shope" className="btn btn-primary">
          Shop-এ ফিরে যান
        </Link>
      </div>
    );
  }

  const qty = Math.max(1, Number(order.quantity) || 1);
  const totalPrice = Number(product.price || 0) * qty;
  const title = product.title || product.name || "Product";
  const image = product.image || product.thumbnail;

  return (
    <div className="mx-auto max-w-5xl p-4 md:p-8">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="text-2xl font-bold">চেকআউট</h1>
        <Link to={`/shope/${id}`} className="text-sm text-blue-600 hover:underline">
          ← পণ্যে ফিরে যান
        </Link>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Order summary */}
        <div className="h-fit rounded-xl border p-4 lg:w-2/5">
          <h2 className="mb-3 font-bold">আপনার পণ্য</h2>
          <div className="flex gap-3">
            {image && (
              <img
                src={image}
                alt={title}
                className="h-20 w-20 rounded-lg border object-contain"
              />
            )}
            <div>
              <p className="font-semibold">{title}</p>
              <p className="text-[#E35335] font-bold">
                ৳ {Number(product.price || 0).toLocaleString("en-BD")}
              </p>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <span className="font-semibold">মোট ({qty} টি)</span>
            <span className="text-lg font-bold">
              ৳ {totalPrice.toLocaleString("en-BD")}
            </span>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            ডেলিভারি চার্জ (থাকলে) অর্ডার নিশ্চিত হওয়ার সময় যোগ হবে।
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-3 rounded-xl border p-4 shadow-sm lg:w-3/5"
        >
          {status.text && (
            <div
              className={`rounded-lg p-3 text-sm ${
                status.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {status.text}
            </div>
          )}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              type="text"
              name="name"
              value={order.name}
              onChange={handleChange}
              placeholder="আপনার নাম *"
              className="input input-bordered w-full"
              required
            />
            <input
              type="tel"
              name="phone"
              value={order.phone}
              onChange={handleChange}
              placeholder="মোবাইল (01XXXXXXXXX) *"
              className="input input-bordered w-full"
              required
            />
          </div>

          <input
            type="email"
            name="email"
            value={order.email}
            onChange={handleChange}
            placeholder="ইমেইল (ঐচ্ছিক)"
            className="input input-bordered w-full"
          />

          <textarea
            name="address"
            value={order.address}
            onChange={handleChange}
            placeholder="পুরো ঠিকানা *"
            rows="2"
            className="textarea textarea-bordered w-full"
            required
          />

          <div className="flex items-center gap-3">
            <label className="font-semibold">পরিমাণ:</label>
            <input
              type="number"
              name="quantity"
              min="1"
              max={Math.min(20, Number(product.stock) || 20)}
              value={order.quantity}
              onChange={handleChange}
              className="input input-bordered w-24"
            />
          </div>

          <textarea
            name="note"
            value={order.note}
            onChange={handleChange}
            placeholder="নোট (ঐচ্ছিক)"
            rows="2"
            className="textarea textarea-bordered w-full"
          />

          {/* Payment */}
          <div className="space-y-2">
            <p className="font-semibold">পেমেন্ট পদ্ধতি</p>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value={PAY_COD}
                checked={order.paymentMethod === PAY_COD}
                onChange={handleChange}
              />
              ক্যাশ অন ডেলিভারি
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value={PAY_BKASH}
                checked={isBkash}
                onChange={handleChange}
              />
              bKash
            </label>
          </div>

          {isBkash && (
            <div className="space-y-2 rounded-lg border border-pink-200 bg-pink-50 p-3 text-sm">
              <p>
                প্রথমে bKash অ্যাপ থেকে <b>Send Money</b> করুন:
              </p>
              <p className="text-lg font-bold text-pink-700">{BKASH_NUMBER}</p>
              <p>
                টাকার পরিমাণ: <b>৳ {totalPrice.toLocaleString("en-BD")}</b>
              </p>
              <p>তারপর যে TrxID পেয়েছেন সেটা নিচে লিখুন।</p>
              <input
                type="text"
                name="trxID"
                value={order.trxID}
                onChange={handleChange}
                placeholder="TrxID (যেমন 8N7A6D5E4F) *"
                className="input input-bordered w-full uppercase"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={sending}
            className="btn w-full border-none bg-orange-500 text-white hover:bg-orange-600"
          >
            {sending ? "পাঠানো হচ্ছে..." : "অর্ডার নিশ্চিত করুন"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;