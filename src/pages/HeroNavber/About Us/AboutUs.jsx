import React from "react";
import {
  FaHome,
  FaTools,
  FaShoppingCart,
  FaThumbsUp,
  FaBullseye,
  FaCheckCircle,
} from "react-icons/fa";

const ABOUT_PARAGRAPHS = [
  "আমরা একটি আধুনিক ও নির্ভরযোগ্য Home Service, Servicing Center এবং Electronics Shop। আমাদের লক্ষ্য হলো গ্রাহকের প্রয়োজনীয় সেবা ও পণ্য একটি জায়গা থেকেই সহজে প্রদান করা।",
  "আপনার বাসা বা অফিসে প্রয়োজনীয় PC, Laptop, CCTV, Electrical এবং Glass Service থেকে শুরু করে আমাদের Servicing Center-এ Hardware & Software Repair, Troubleshooting এবং বিভিন্ন ধরনের Technical Support প্রদান করা হয়।",
  "এর পাশাপাশি আমাদের Electronics Shop-এ বিভিন্ন ধরনের Computer Accessories, Electronic Products, Spare Parts এবং প্রয়োজনীয় যন্ত্রাংশ পাওয়া যায়। অর্থাৎ, আপনার কোনো ডিভাইস নষ্ট হলে শুধু Repair নয়, প্রয়োজন হলে প্রয়োজনীয় Parts বা নতুন Product-ও আমাদের কাছ থেকে নিতে পারবেন।",
];

const SERVICES = [
  {
    title: "Home Service",
    Icon: FaHome,
    card: "bg-blue-50 ring-blue-100",
    circle: "bg-blue-100 text-blue-700",
    titleColor: "text-blue-800",
    check: "text-blue-600",
    items: [
      "PC & Laptop Service",
      "CCTV Installation & Service",
      "Electrical Service",
      "Networking Service",
      "Software & Hardware Support",
    ],
  },
  {
    title: "Servicing Center",
    Icon: FaTools,
    card: "bg-green-50 ring-green-100",
    circle: "bg-green-100 text-green-600",
    titleColor: "text-green-700",
    check: "text-green-600",
    items: [
      "Computer & Laptop Repair",
      "Hardware Troubleshooting",
      "Windows & Software Setup",
      "CCTV DVR/NVR Service",
      "Printer & Networking Support",
    ],
  },
  {
    title: "Electronics Shop",
    Icon: FaShoppingCart,
    card: "bg-orange-50 ring-orange-100",
    circle: "bg-orange-100 text-orange-500",
    titleColor: "text-orange-600",
    check: "text-orange-500",
    items: [
      "Computer & Laptop Accessories",
      "Keyboard & Mouse",
      "অন্যান্য প্রয়োজনীয় Electronic Parts",
      "CCTV Camera & Accessories",
      "Electrical Products",
    ],
  },
  {
    title: "কেন আমাদের বেছে নেবেন",
    Icon: FaThumbsUp,
    card: "bg-purple-50 ring-purple-100",
    circle: "bg-purple-100 text-purple-600",
    titleColor: "text-purple-700",
    check: "text-purple-600",
    items: [
      "Home Service সুবিধা",
      "নিজস্ব Servicing Center",
      "প্রয়োজনীয় Parts ও Products একই জায়গায়",
      "সাশ্রয়ী মূল্য",
      "দ্রুত ও নির্ভরযোগ্য Service",
    ],
  },
];

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-white py-8 md:py-12">
      <div className="mx-auto max-w-5xl space-y-8 px-4">
        {/* ---------- Header ---------- */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#0f1f4b] md:text-4xl">
            আমাদের সম্পর্কে
          </h1>
          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-blue-800 to-blue-500" />
        </div>

        {/* ---------- About text ---------- */}
        <div className="space-y-4 rounded-3xl border-l-8 border-blue-800 bg-white p-6 shadow-xl ring-1 ring-blue-100 md:p-8">
          {ABOUT_PARAGRAPHS.map((text) => (
            <p
              key={text}
              className="text-base leading-relaxed text-gray-700 md:text-lg"
            >
              {text}
            </p>
          ))}
        </div>

        {/* ---------- Services ---------- */}
        <div>
          <div className="mb-5 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-blue-900 to-blue-800 px-6 py-4 text-white shadow-lg">
            <FaCheckCircle className="shrink-0 text-2xl" />
            <h2 className="text-xl font-bold md:text-2xl">
              আমাদের প্রধান সেবাসমূহ
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICES.map(
              ({ title, Icon, card, circle, titleColor, check, items }) => (
                <div
                  key={title}
                  className={`rounded-2xl p-5 shadow-md ring-1 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${card}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-xl ${circle}`}
                    >
                      <Icon />
                    </div>
                    <h3 className={`text-lg font-bold leading-tight ${titleColor}`}>
                      {title}
                    </h3>
                  </div>

                  <ul className="mt-4 space-y-2">
                    {items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-[15px] text-gray-700"
                      >
                        <FaCheckCircle
                          className={`mt-1 shrink-0 text-sm ${check}`}
                        />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )
            )}
          </div>
        </div>

        {/* ---------- Mission ---------- */}
        <div className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-blue-100">
          <div className="flex items-center gap-4 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 px-6 py-5 text-white">
            <FaBullseye className="shrink-0 text-4xl" />
            <h2 className="text-2xl font-bold md:text-3xl">আমাদের লক্ষ্য</h2>
          </div>

          <div className="space-y-5 p-6 md:p-8">
            <p className="text-base leading-relaxed text-gray-700 md:text-lg">
              আমাদের লক্ষ্য হলো Service, Repair এবং Product—সবকিছু একটি নির্ভরযোগ্য
              জায়গা থেকে প্রদান করা। আমরা চাই, গ্রাহককে একটি সমস্যার জন্য বিভিন্ন
              জায়গায় যেতে না হয়। প্রয়োজন অনুযায়ী Home Service, Servicing Center
              এবং Electronics Shop—সব ধরনের সুবিধা আমরা একসাথে দিতে চাই।
            </p>

            <div className="rounded-2xl bg-blue-50 p-5 ring-1 ring-blue-100">
              <h3 className="text-xl font-bold text-blue-800">
                আপনার প্রয়োজন, আমাদের সমাধান
              </h3>
              <p className="mt-2 text-base leading-relaxed text-gray-700 md:text-lg">
                Service নিতে চান, Device Repair করতে চান, নাকি প্রয়োজনীয়
                Electronics Product কিনতে চান? আমাদের সাথে যোগাযোগ করুন। আমরা আপনার
                প্রয়োজন অনুযায়ী দ্রুত, নির্ভরযোগ্য এবং পেশাদার সেবা দেওয়ার চেষ্টা
                করব।
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;