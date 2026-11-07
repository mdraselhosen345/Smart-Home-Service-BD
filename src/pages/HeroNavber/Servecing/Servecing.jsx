import React, { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

import PCService from "../../../assets/ServiceBackground/PcService.png";
import CCTVBac from "../../../assets/ServiceBackground/CCTVBAC.png";
import Electronic from "../../../assets/ServiceBackground/ElectronicService.png";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  address: "",
  serviceName: "",
  message: "",
};

const BANNERS = [PCService, Electronic, CCTVBac, Electronic];

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
  <Stroke className="h-9 w-9 shrink-0">
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
const ClipboardIcon = () => (
  <Stroke className="h-8 w-8">
    <rect x="8" y="2" width="8" height="4" rx="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
  </Stroke>
);
const TagIcon = () => (
  <Stroke className="h-8 w-8">
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" />
    <circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
  </Stroke>
);
const PackageIcon = () => (
  <Stroke className="h-8 w-8">
    <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
    <path d="M12 22V12" />
    <path d="m3.3 7 7.703 4.734a2 2 0 0 0 1.994 0L20.7 7" />
    <path d="m7.5 4.27 9 5.15" />
  </Stroke>
);
const TruckIcon = () => (
  <Stroke className="h-8 w-8">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" />
    <path d="M15 18H9" />
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" />
    <circle cx="17" cy="18" r="2" />
    <circle cx="7" cy="18" r="2" />
  </Stroke>
);
const HeartIcon = () => (
  <Stroke className="h-8 w-8">
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </Stroke>
);

const STEPS = [
  {
    title: "১. আপনার সমস্যার বিবরণ দিন",
    text: "আপনার ডিভাইস বা বাসার সার্ভিসিং সমস্যার বিস্তারিত আমাদের জানান। অনলাইনে সার্ভিস রিকোয়েস্ট জমা দিন অথবা সরাসরি আমাদের সার্ভিস সেন্টারে যোগাযোগ করুন।",
    Icon: ClipboardIcon,
    row: "bg-blue-50",
    circle: "bg-blue-100 text-blue-700",
    titleColor: "text-blue-800",
  },
  {
    title: "২. সার্ভিসের খরচ জেনে নিন",
    text: "আপনার সমস্যার ধরন অনুযায়ী আমরা প্রয়োজনীয় সার্ভিস, সম্ভাব্য খরচ এবং উপযুক্ত সমাধান সম্পর্কে আপনাকে বিস্তারিত জানাব।",
    Icon: TagIcon,
    row: "bg-green-50",
    circle: "bg-green-100 text-green-600",
    titleColor: "text-green-700",
  },
  {
    title: "৩. বাসা থেকে ডিভাইস সংগ্রহ",
    text: "ডিভাইস নিয়ে বাইরে যাওয়ার ঝামেলা এড়াতে আপনার সুবিধা অনুযায়ী আমরা বাসা থেকে ডিভাইস সংগ্রহ করে আমাদের সার্ভিস সেন্টারে নিয়ে আসব।",
    Icon: PackageIcon,
    row: "bg-orange-50",
    circle: "bg-orange-100 text-orange-500",
    titleColor: "text-orange-600",
  },
  {
    title: "৪. মেরামতের পর হোম ডেলিভারি",
    text: "মেরামতের কাজ সম্পন্ন হলে আমরা আপনার ডিভাইসটি নিরাপদে আবার আপনার বাসায় পৌঁছে দেব। ফলে সার্ভিস সেন্টারে আসা-যাওয়ার ঝামেলা ছাড়াই ঘরে বসে সার্ভিস গ্রহণ করতে পারবেন।",
    Icon: TruckIcon,
    row: "bg-purple-50",
    circle: "bg-purple-100 text-purple-600",
    titleColor: "text-purple-700",
  },
  {
    title: "৫. আপনার সন্তুষ্টিই আমাদের সাফল্য",
    text: "আপনার সন্তুষ্টিই আমাদের প্রধান লক্ষ্য। মানসম্মত সার্ভিস, আন্তরিক সহযোগিতা ও নির্ভরযোগ্য সমাধানের মাধ্যমে আমরা আপনার আস্থা অর্জনে প্রতিশ্রুতিবদ্ধ।",
    Icon: HeartIcon,
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

const Servecing = () => {
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
        body: JSON.stringify(form),
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
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-white pb-12">
      {/* ---------- Banner ---------- */}
      <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
        {BANNERS.map((src, index) => (
          <div key={index}>
            <img
              src={src}
              alt="সার্ভিস ব্যানার"
              className="h-[350px] w-full object-cover"
            />
          </div>
        ))}
      </Carousel>

      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-8 px-4 lg:grid-cols-2">
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
                <PinIcon /> Address
              </label>
              <input
                id="address"
                type="text"
                name="address"
                value={form.address}
                onChange={handleChange}
                className={fieldClass}
                placeholder="আপনার ঠিকানা লিখুন"
              />
            </div>

            {/* Service */}
            <div>
              <label htmlFor="serviceName" className={labelClass}>
                <StarIcon /> The Best Service For You <Star />
              </label>
              <input
                id="serviceName"
                type="text"
                name="serviceName"
                value={form.serviceName}
                onChange={handleChange}
                className={fieldClass}
                placeholder="সার্ভিসের নাম লিখুন"
                required
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
          {/* Header */}
          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4 text-white shadow-lg">
            <ShieldIcon />
            <h2 className="text-lg font-bold md:text-xl">
              আপনার সার্ভিসিং সমস্যার সহজ ও নির্ভরযোগ্য সমাধান
            </h2>
          </div>

          <p className="mt-3 px-2 leading-relaxed text-gray-600">
            আমরা আপনার সুবিধাকে গুরুত্ব দিয়ে বাসায় সার্ভিস প্রদান এবং ডিভাইস সংগ্রহ থেকে শুরু করে মেরামত ও হোম ডেলিভারি পর্যন্ত সেবা দেওয়ার চেষ্টা করি।
          </p>

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

export default Servecing;