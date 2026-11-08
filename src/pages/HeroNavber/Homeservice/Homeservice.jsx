import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import React, { useEffect, useState } from "react";
import { Link } from "react-router";

import PCService from "../../../assets/ServiceBackground/PcService.png";
import CCTVBac from "../../../assets/ServiceBackground/CCTVBac.png";
import Electronic from "../../../assets/ServiceBackground/ElectronicService.png";

// card home service
import PcHomeservice from "../../../assets/HomeService/PcHomeservice.png";
import ElectricHome from "../../../assets/HomeService/ElectricHome.png";
import CctvHome from "../../../assets/HomeService/CctvHome.png";
import GlassHome from "../../../assets/HomeService/GlassHome.png";

const BANNERS = [
  { src: PCService, alt: "ডেস্কটপ ও ল্যাপটপ সার্ভিস" },
  { src: Electronic, alt: "বৈদ্যুতিক যন্ত্রপাতি সার্ভিস" },
  { src: CCTVBac, alt: "CCTV ক্যামেরা সার্ভিস" },
];

const SERVICES = [
  {
    to: "/LaptopPc",
    img: PcHomeservice,
    title: "ডেস্কটপ ও ল্যাপটপ মেরামত",
  },
  {
    to: "/Cctv",
    img: CctvHome,
    title: "CCTV ক্যামেরা স্থাপন ও মেরামত",
  },
  {
    to: "/Electronic",
    img: ElectricHome,
    title: "বৈদ্যুতিক যন্ত্রপাতি সার্ভিসিং",
  },
  {
    to: "/Glass",
    img: GlassHome,
    title: "Glass ইনস্টলেশন ও মেরামত",
  },
];

const ArrowIcon = () => (
  <svg
    className="h-5 w-5"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14M13 6l6 6-6 6" />
  </svg>
);

const Homeservice = () => {
  const [homeservice, setHomeservice] = useState([]);

  useEffect(() => {
    fetch("/homeservice.json")
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setHomeservice(data);
      })
      .catch((error) => console.error(error));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-white pb-12">
      {/* ---------- Banner ---------- */}
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
      >
        {BANNERS.map((banner) => (
          <div key={banner.alt}>
            <img
              src={banner.src}
              alt={banner.alt}
              className="h-[350px] w-full object-cover"
            />
          </div>
        ))}
      </Carousel>

      {/* ---------- Heading ---------- */}
      <div className="mx-auto mt-10 max-w-6xl px-4 text-center">
        <h1 className="text-2xl font-bold text-[#0f1f4b] md:text-3xl">
          আমাদের হোম সার্ভিস
        </h1>
        <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-blue-800 to-blue-500" />
        <p className="mt-3 text-gray-500">
          আপনার প্রয়োজনের সেবাটি বেছে নিন, আমরা পৌঁছে যাব আপনার দরজায়
        </p>
      </div>

      {/* ---------- Service cards ---------- */}
      <div className="mx-auto mt-8 grid max-w-6xl grid-cols-1 gap-5 px-4 sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service) => (
          <Link
            key={service.to}
            to={service.to}
            className="group flex flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-blue-100 transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:ring-blue-300"
          >
            {/* Image */}
            <div className="overflow-hidden">
              <img
                src={service.img}
                alt={service.title}
                className="h-44 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>

            {/* Title */}
            <div className="flex-1 px-4 pt-4">
              <h2 className="text-lg font-bold leading-snug text-[#0f1f4b]">
                {service.title}
              </h2>
            </div>

            {/* Button */}
            <div className="p-4">
              <span className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition-all duration-300 group-hover:from-blue-900 group-hover:to-blue-700">
                Book Now
                <ArrowIcon />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Homeservice;