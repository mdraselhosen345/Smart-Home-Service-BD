import React from "react";
import Complne from "../../../assets/complne.png";
import online from "../../../assets/online-Service.png";
import { Link } from "react-router";
import {
  FaPhoneAlt,
  FaWhatsapp,
  FaMapMarkerAlt,
  FaClock,
  FaArrowRight,
} from "react-icons/fa";
import { ImFacebook2 } from "react-icons/im";

const PHONE = "01782299570";
const FACEBOOK_URL = "https://www.facebook.com/profile.php?id=61595514920705";
const ADDRESS = "Khangan Bajar, Khagan, Birulia, Savar, Dhaka";
const DIRECTION_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  ADDRESS
)}`;

const MAP_SRC =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2997.6028824862888!2d90.31184567431364!3d23.874384034007125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c30036d30273%3A0x42f3e7acec19669a!2sAsadul%20Hair%20salon%20%E2%9C%84!5e1!3m2!1sen!2sbd!4v1786681024185!5m2!1sen!2sbd";

const SUPPORT_CARDS = [
  {
    img: Complne,
    small: "Talk to Expert",
    title: "Get Online Support",
    linkText: "Request Support",
    to: "/ComplaintForm",
  },
  {
    img: online,
    small: "Share Your Experience",
    title: "Any Complain On Us?",
    linkText: "Raise a Complaint",
    to: "/ComplaintForm",
  },
];

/* ---------- Reusable pieces ---------- */
const cardClass =
  "rounded-2xl bg-white shadow-lg ring-1 ring-blue-100 transition-all duration-300";

const ContactRow = ({ icon, circle, label, value, href, external }) => (
  <a
    href={href}
    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    className={`${cardClass} group flex items-center gap-4 px-5 py-4 hover:-translate-y-1 hover:shadow-xl hover:ring-blue-300`}
  >
    <div
      className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-2xl ${circle}`}
    >
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="break-all text-lg font-bold text-[#0f1f4b] sm:text-xl">
        {value}
      </p>
    </div>
  </a>
);

const Contact = () => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-100 via-blue-50 to-white py-8 md:py-12">
      <div className="mx-auto max-w-5xl">
        {/* ---------- Heading ---------- */}
        <div className="px-4 text-center md:px-5">
          <h1 className="text-2xl font-bold text-[#0f1f4b] md:text-3xl">
            Contact Us
          </h1>
          <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-blue-800 to-blue-500" />
          <p className="mt-3 text-gray-500">
            যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করুন, আমরা আছি আপনার পাশে
          </p>
        </div>

        {/* ---------- Contact info + Support ---------- */}
        <div className="mt-8 flex flex-col gap-5 px-4 md:px-5 lg:flex-row">
          {/* Contact methods */}
          <div className="flex w-full flex-col gap-3 lg:w-[400px]">
            <ContactRow
              icon={<FaPhoneAlt />}
              circle="bg-blue-100 text-blue-700"
              label="Contact Number"
              value={PHONE}
              href={`tel:${PHONE}`}
            />

            <ContactRow
              icon={<FaWhatsapp />}
              circle="bg-green-100 text-green-600"
              label="Whatsapp Number"
              value={PHONE}
              href={`https://wa.me/88${PHONE}`}
              external
            />

            <ContactRow
              icon={<ImFacebook2 />}
              circle="bg-indigo-100 text-indigo-700"
              label="Follow us on"
              value="Facebook Page"
              href={FACEBOOK_URL}
              external
            />
          </div>

          {/* Online Support & Complaint */}
          <div className="grid w-full min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">
            {SUPPORT_CARDS.map((card) => (
              <div
                key={card.title}
                className={`${cardClass} flex min-w-0 flex-col items-center justify-center gap-3 px-4 py-5 text-center hover:-translate-y-1 hover:shadow-xl`}
              >
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-blue-50 p-3 ring-1 ring-blue-100">
                  <img
                    src={card.img}
                    alt={card.title}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-blue-800">
                    {card.small}
                  </h3>
                  <h2 className="mt-1 text-lg font-bold text-[#0f1f4b] md:text-xl">
                    {card.title}
                  </h2>
                </div>

                <Link
                  to={card.to}
                  className="mt-1 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition hover:from-blue-900 hover:to-blue-700"
                >
                  {card.linkText}
                  <FaArrowRight className="text-xs" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- Home Address & Shop Location ---------- */}
        <div className="flex flex-col gap-5 px-4 pt-6 md:flex-row md:px-5 md:pt-8">
          {/* Home Address */}
          <div className={`${cardClass} w-full min-w-0 self-start p-6 md:w-1/3`}>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xl text-orange-500">
                <FaMapMarkerAlt />
              </div>
              <h2 className="text-xl font-bold text-[#0f1f4b] md:text-2xl">
                Home Address
              </h2>
            </div>

            <p className="mt-4 break-words text-base leading-relaxed text-gray-700 md:text-lg">
              {ADDRESS}
            </p>

            <a
              href={DIRECTION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 font-semibold text-blue-700 hover:underline"
            >
              Get Direction
              <FaArrowRight className="text-xs" />
            </a>

            <div className="mt-5 space-y-2 border-t border-blue-100 pt-4 text-sm text-gray-600">
              <p className="flex items-center gap-2">
                <FaClock className="text-blue-700" />
                5 PM - 10 PM
              </p>
              <p className="flex items-center gap-2">
                <FaClock className="text-green-600" />
                Available All Day
              </p>
            </div>
          </div>

          {/* Shop Location */}
          <div className={`${cardClass} w-full min-w-0 p-6 md:w-2/3`}>
            <h2 className="mb-4 text-xl font-bold text-[#0f1f4b] md:text-2xl">
              Our Shop Location
            </h2>

            <div className="h-[250px] w-full overflow-hidden rounded-xl shadow-lg ring-1 ring-blue-100 sm:h-[300px] md:h-[400px]">
              <iframe
                src={MAP_SRC}
                className="h-full w-full border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Our Shop Location"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
