import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const COMPLAINT_TYPES = [
  "সার্ভিসে দেরি",
  "পণ্যের সমস্যা",
  "কর্মীর আচরণ",
  "বিলিং বা পেমেন্ট",
  "অন্যান্য",
];

const initialForm = {
  name: "",
  phone: "",
  email: "",
  serviceName: "",
  subject: "",
  message: "",
};

/* ---------- Icons ---------- */
const iconClass = "h-6 w-6 shrink-0 text-blue-800";

const UserIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.76-3.58-5-8-5Z" />
  </svg>
);

const MailIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 5h18a1 1 0 0 1 1 1v.51l-10 6.25L2 6.51V6a1 1 0 0 1 1-1Zm19 3.86V18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8.86l9.47 5.92a1 1 0 0 0 1.06 0L22 8.86Z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
  </svg>
);

const ListIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 5h3v3H3V5Zm5 .5h13v2H8v-2ZM3 10.5h3v3H3v-3Zm5 .5h13v2H8v-2ZM3 16h3v3H3v-3Zm5 .5h13v2H8v-2Z" />
  </svg>
);

const DocIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2Zm1 9v2h10v-2H7Zm0 4v2h10v-2H7Zm0-8v2h5V7H7Z" />
  </svg>
);

const ChatIcon = () => (
  <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 3C6.48 3 2 6.58 2 11c0 2.38 1.3 4.5 3.36 5.97L4.5 21l4.26-2.13c1.04.28 2.14.43 3.24.43 5.52 0 10-3.58 10-8s-4.48-8-10-8Zm-4 9a1.25 1.25 0 1 1 0-2.5A1.25 1.25 0 0 1 8 12Zm4 0a1.25 1.25 0 1 1 0-2.5A1.25 1.25 0 0 1 12 12Zm4 0a1.25 1.25 0 1 1 0-2.5A1.25 1.25 0 0 1 16 12Z" />
  </svg>
);

/* ---------- Styles ---------- */
const labelClass =
  "mb-2 flex items-center gap-3 text-base font-semibold text-[#0f1f4b]";
const fieldClass =
  "w-full rounded-md border border-blue-200 bg-white px-3 py-2.5 text-[15px] text-gray-800 placeholder-gray-500 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
const Star = () => <span className="text-red-500">*</span>;

const ComplaintForm = () => {
  const [formData, setFormData] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      // Subject আলাদা ফিল্ড নয়, তাই message এর শুরুতে জুড়ে পাঠানো হয়
      const { subject, ...rest } = formData;
      const payload = { ...rest, message: `${subject}\n\n${rest.message}` };

      const response = await fetch(`${API_URL}/complaints`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.message || "Could not submit your request.");
      }

      setFormData(initialForm);
      setMessage({
        type: "success",
        text: "আপনার অভিযোগ সফলভাবে জমা হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।",
      });
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Something went wrong." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <form
        onSubmit={handleSubmit}
        className="rounded-xl bg-white p-6 shadow-xl md:p-8"
      >
        {message.text && (
          <div
            className={`mb-5 rounded-lg p-3 text-sm ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 gap-x-12 gap-y-5 md:grid-cols-2">
          {/* Name */}
          <div>
            <label htmlFor="name" className={labelClass}>
              <UserIcon />
              <span>
                Your Name <Star />
              </span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              className={fieldClass}
              placeholder="আপনার নাম লিখুন"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className={labelClass}>
              <MailIcon />
              <span>
                Email Address <Star />
              </span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={fieldClass}
              placeholder="আপনার ইমেইল ঠিকানা লিখুন"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className={labelClass}>
              <PhoneIcon />
              <span>
                Phone Number <Star />
              </span>
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              pattern="01[3-9][0-9]{8}"
              title="১১ ডিজিটের বাংলাদেশি নম্বর দিন (যেমন 017XXXXXXXX)"
              value={formData.phone}
              onChange={handleChange}
              className={fieldClass}
              placeholder="মোবাইল নম্বর লিখুন"
            />
          </div>

          {/* Complaint Type -> serviceName */}
          <div>
            <label htmlFor="serviceName" className={labelClass}>
              <ListIcon />
              <span>
                Complaint Type <Star />
              </span>
            </label>
            <select
              id="serviceName"
              name="serviceName"
              required
              value={formData.serviceName}
              onChange={handleChange}
              className={fieldClass}
            >
              <option value="">-- নির্বাচন করুন --</option>
              {COMPLAINT_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Subject */}
        <div className="mt-5">
          <label htmlFor="subject" className={labelClass}>
            <DocIcon />
            <span>
              Subject <Star />
            </span>
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            value={formData.subject}
            onChange={handleChange}
            className={fieldClass}
            placeholder="অভিযোগের বিষয় লিখুন (যেমন: সার্ভিসে দেরি, পণ্যের সমস্যা ইত্যাদি)"
          />
        </div>

        {/* Details -> message */}
        <div className="mt-5">
          <label htmlFor="message" className={labelClass}>
            <ChatIcon />
            <span>
              Your Complaint Details <Star />
            </span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            value={formData.message}
            onChange={handleChange}
            className={`${fieldClass} resize-y`}
            placeholder="আপনার অভিযোগের বিস্তারিত বিবরণ লিখুন..."
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="mt-6 w-full rounded-md bg-blue-800 py-3 font-semibold text-white transition hover:bg-blue-900 disabled:opacity-60"
        >
          {submitting ? "জমা হচ্ছে..." : "Submit Complaint"}
        </button>
      </form>
    </div>
  );
};

export default ComplaintForm;