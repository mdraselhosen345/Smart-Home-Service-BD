import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SERVICE_NAME = "Electronic";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  serviceName: "",
  message: "",
};

/* ---------- Icons (inline SVG, কোনো প্যাকেজ লাগে না) ---------- */
const Stroke = ({ className = "h-6 w-6", children }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {children}
  </svg>
);

const Fill = ({ className = "h-5 w-5", d }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d={d} />
  </svg>
);

const HeadsetIcon = () => (
  <Stroke className="h-12 w-12">
    <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5Zm0 0a9 9 0 1 1 18 0m0 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3Z" />
    <path d="M21 16v2a4 4 0 0 1-4 4h-5" />
  </Stroke>
);

const ShieldIcon = () => (
  <Stroke className="h-9 w-9">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    <path d="m9 12 2 2 4-4" />
  </Stroke>
);

const SendIcon = () => (
  <Stroke className="h-5 w-5">
    <path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" />
    <path d="m21.854 2.147-10.94 10.939" />
  </Stroke>
);

const labelIcon = "h-5 w-5 shrink-0 text-blue-800";

const UserIcon = () => (
  <Fill className={labelIcon} d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-1c0-2.76-3.58-5-8-5Z" />
);
const PhoneIcon = () => (
  <Fill className={labelIcon} d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
);
const MailIcon = () => (
  <Fill className={labelIcon} d="M3 5h18a1 1 0 0 1 1 1v.51l-10 6.25L2 6.51V6a1 1 0 0 1 1-1Zm19 3.86V18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8.86l9.47 5.92a1 1 0 0 0 1.06 0L22 8.86Z" />
);
const PinIcon = () => (
  <Fill className={labelIcon} d="M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5Z" />
);
const StarIcon = () => (
  <Fill className={labelIcon} d="m12 2 3.09 6.26L22 9.27l-5 4.87L18.18 21 12 17.77 5.82 21 7 14.14 2 9.27l6.91-1.01L12 2Z" />
);
const ChatIcon = () => (
  <Fill className={labelIcon} d="M4 3h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H8l-4.3 3.6A.5.5 0 0 1 3 21.2V5a2 2 0 0 1 1-2Zm4 6.25a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm4 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Zm4 0a1.25 1.25 0 1 0 0 2.5 1.25 1.25 0 0 0 0-2.5Z" />
);

/* ---------- Step icons ---------- */
const BoltIcon = () => (
  <Stroke className="h-8 w-8">
    <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
  </Stroke>
);
const CallIcon = () => (
  <Fill className="h-8 w-8" d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.61 21 3 13.39 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z" />
);
const GearIcon = () => (
  <Stroke className="h-8 w-8">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
    <circle cx="12" cy="12" r="3" />
  </Stroke>
);
const WrenchIcon = () => (
  <Stroke className="h-8 w-8">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
  </Stroke>
);
const DoneIcon = () => (
  <Stroke className="h-8 w-8">
    <circle cx="12" cy="12" r="10" />
    <path d="m9 12 2 2 4-4" />
  </Stroke>
);

const STEPS = [
  {
    title: "আপনার সমস্যার বিবরণ দিন",
    text: "আপনার বাসার ফ্যান, লাইট, সুইচ, বৈদ্যুতিক সংযোগ অথবা অন্যান্য ইলেকট্রিক্যাল সমস্যার বিস্তারিত তথ্য অনলাইনে অথবা আমাদের সঙ্গে যোগাযোগের মাধ্যমে জানান।",
    Icon: BoltIcon,
    row: "bg-blue-50",
    circle: "bg-blue-100 text-blue-700",
    titleColor: "text-blue-800",
  },
  {
    title: "দর জেনে নিন",
    text: "আমরা আপনাকে ফোন বা সরাসরি সাক্ষাতের মাধ্যমে ইলেকট্রিক্যাল হোম সার্ভিস, মেরামত এবং প্রয়োজনীয় সরঞ্জামের খরচ সম্পর্কে বিস্তারিত জানাব।",
    Icon: CallIcon,
    row: "bg-green-50",
    circle: "bg-green-100 text-green-600",
    titleColor: "text-green-700",
  },
  {
    title: "পরিষেবা পরিকল্পনা অনুমোদন করুন",
    text: "প্রস্তাবিত ইলেকট্রিক্যাল সার্ভিস পরিকল্পনা ও খরচের প্রাক্কলন পর্যালোচনা করে অনুমোদন করুন।",
    Icon: GearIcon,
    row: "bg-orange-50",
    circle: "bg-orange-100 text-orange-500",
    titleColor: "text-orange-600",
  },
  {
    title: "আপনার ইলেকট্রিক্যাল হোম সার্ভিস গ্রহণ করুন",
    text: "বাসায় ফ্যান, লাইট, সুইচ, বৈদ্যুতিক সংযোগ স্থাপন, মেরামত অথবা প্রয়োজনীয় ইলেকট্রিক্যাল কাজের জন্য আমাদের হোম সার্ভিস গ্রহণ করুন।",
    Icon: WrenchIcon,
    row: "bg-purple-50",
    circle: "bg-purple-100 text-purple-600",
    titleColor: "text-purple-700",
  },
  {
    title: "আপনার ইলেকট্রিক্যাল সার্ভিস সম্পন্ন করুন",
    text: "কাজ সম্পন্ন হলে বৈদ্যুতিক সংযোগ ও সংশ্লিষ্ট যন্ত্রপাতি পরীক্ষা করে বুঝে নিন। আমরা আপনাকে প্রয়োজনীয় ব্যবহারবিধি ও নিরাপত্তা নির্দেশনা প্রদান করব।",
    Icon: DoneIcon,
    row: "bg-teal-50",
    circle: "bg-teal-100 text-teal-600",
    titleColor: "text-teal-700",
  },
];

/* ---------- Styles ---------- */
const labelClass =
  "mb-1.5 flex items-center gap-2 text-[15px] font-semibold text-[#0f1f4b]";
const fieldClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 text-[15px] text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100";
const Star = () => <span className="text-red-500">*</span>;

const Electronic = () => {
  const [form, setForm] = useState(emptyForm);
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", text: "" });
    setSending(true);

    try {
      const response = await fetch(`${API_URL}/service-requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          serviceName: form.serviceName.trim() || SERVICE_NAME,
          category: "Home Service",
        }),
      });
      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        const detail = Array.isArray(result.details)
          ? result.details.map((d) => `${d.field}: ${d.message}`).join(", ")
          : "";
        throw new Error(
          `${result.message || "Request could not be sent."}${
            detail ? ` (${detail})` : ""
          }`
        );
      }

      setStatus({
        type: "success",
        text: "আপনার রিকোয়েস্ট পাঠানো হয়েছে। আমরা শীঘ্রই যোগাযোগ করব।",
      });
      setForm(emptyForm);
    } catch (err) {
      setStatus({ type: "error", text: `Error: ${err.message}` });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-white px-4 py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-2">
        {/* ---------- Left: Form ---------- */}
        <div className="self-start overflow-hidden rounded-3xl bg-white shadow-2xl ring-1 ring-blue-100">
          {/* Header */}
          <div className="flex items-center gap-4 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 px-6 py-5 text-white">
            <HeadsetIcon />
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">সেবা গ্রহণ করুন</h1>
              <p className="mt-1 text-sm text-blue-100">
                আপনার অভিযোগ জানান, আমরা আছি আপনার পাশে
              </p>
            </div>
          </div>

          <form className="space-y-4 p-6" onSubmit={handleSubmit}>
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

            {/* Name & Phone */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="name" className={labelClass}>
                  <UserIcon /> Name <Star />
                </label>
                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className={fieldClass}
                  placeholder="আপনার নাম লিখুন"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className={labelClass}>
                  <PhoneIcon /> Phone Number <Star />
                </label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className={fieldClass}
                  placeholder="01XXXXXXXXX"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className={labelClass}>
                <MailIcon /> Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className={fieldClass}
                placeholder="আপনার ইমেইল লিখুন"
              />
            </div>

            {/* Address */}
            <div>
              <label htmlFor="address" className={labelClass}>
                <PinIcon /> Address <Star />
              </label>
              <input
                id="address"
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className={fieldClass}
                placeholder="আপনার ঠিকানা লিখুন"
                required
              />
            </div>

            {/* Service */}
            <div>
              <label htmlFor="serviceName" className={labelClass}>
                <StarIcon /> The Best Service For You
              </label>
              <input
                id="serviceName"
                type="text"
                name="serviceName"
                value={form.serviceName}
                onChange={handleChange}
                className={fieldClass}
                placeholder="Electronic (খালি রাখলে Electronic যাবে)"
              />
            </div>

            {/* Issue */}
            <div>
              <label htmlFor="message" className={labelClass}>
                <ChatIcon /> A little about the issue
              </label>
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                className={`${fieldClass} h-28 resize-y`}
                placeholder="এখানে আপনার সমস্যার বিস্তারিত লিখুন..."
              ></textarea>
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={sending}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 py-3.5 text-lg font-semibold text-white shadow-lg shadow-blue-200 transition hover:from-blue-900 hover:to-blue-700 disabled:opacity-60"
            >
              <SendIcon />
              {sending ? "পাঠানো হচ্ছে..." : "রিকোয়েস্ট পাঠান"}
            </button>
          </form>
        </div>

        {/* ---------- Right: Steps ---------- */}
        <div>
          {/* Pill header */}
          <div className="flex items-center gap-3 rounded-full bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-3 text-white shadow-lg">
            <ShieldIcon />
            <h2 className="text-xl font-bold md:text-2xl">
              এই সহজ ধাপগুলো অনুসরণ করুন
            </h2>
          </div>

          {/* Steps card */}
          <div className="mt-4 space-y-3 rounded-3xl bg-white/80 p-4 shadow-xl ring-1 ring-blue-100 backdrop-blur">
            {STEPS.map(({ title, text, Icon, row, circle, titleColor }) => (
              <div
                key={title}
                className={`flex items-center gap-4 rounded-2xl p-4 ${row}`}
              >
                <div
                  className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${circle}`}
                >
                  <Icon />
                </div>
                <div>
                  <h3 className={`text-lg font-bold ${titleColor}`}>{title}</h3>
                  <p className="mt-1 text-[14px] leading-relaxed text-gray-600">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Electronic;