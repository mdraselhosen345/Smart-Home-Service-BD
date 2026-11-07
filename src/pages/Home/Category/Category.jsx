import React from 'react';
import { FaArrowRight } from "react-icons/fa";
import Router from "../../../assets/router.png";
import { Link } from 'react-router';
import HomeService from "../../../assets/HomeServiceImg/HomeService.png";
import ServecingCenter from "../../../assets/HomeServiceImg/ServecingCenter.png";

// ক্যাটাগরি কার্ডের রং (পর্যায়ক্রমে ঘুরে ঘুরে বসবে)
const CATEGORY_COLORS = [
    { bg: 'bg-blue-50', ring: 'hover:ring-blue-300', text: 'text-blue-800' },
    { bg: 'bg-green-50', ring: 'hover:ring-green-300', text: 'text-green-700' },
    { bg: 'bg-orange-50', ring: 'hover:ring-orange-300', text: 'text-orange-600' },
    { bg: 'bg-purple-50', ring: 'hover:ring-purple-300', text: 'text-purple-700' },
    { bg: 'bg-teal-50', ring: 'hover:ring-teal-300', text: 'text-teal-700' },
];

const Categroy = () => {
    // ক্যাটাগরি ডেটা লিস্ট
    const categories = Array(6).fill({
        img: Router,
        title: "সার্ভিস বুক করুন"
    });

    // সার্ভিস কার্ডের ডেটা
    const services = [
        {
            to: "Homeservice",
            img: HomeService,
            alt: "Home Service",
            title: "সকল হোম সার্ভিস, এক ঠিকানায়",
            text: "আপনার বাসা ও অফিসের বিভিন্ন সার্ভিসের নির্ভরযোগ্য সমাধান এক জায়গায়!",
        },
        {
            to: "/Servecing",
            img: ServecingCenter,
            alt: "Servecing center",
            title: "আপনার বিশ্বস্ত সার্ভিসিং সেন্টার",
            text: "আপনার সকল সার্ভিসিং সমস্যার নির্ভরযোগ্য সমাধান এক ঠিকানায়!",
        },
    ];

    return (
        <div className='mx-auto flex max-w-7xl flex-col justify-between gap-8 p-4 md:p-6 lg:flex-row'>

            {/* ক্যাটাগরি সেকশন */}
            <div className='w-full'>
                <div className='py-4 sm:py-6'>
                    <h1 className='text-xl font-bold text-[#0f1f4b] sm:text-2xl'>
                        জনপ্রিয় ক্যাটাগরি
                    </h1>
                    <div className='mt-2 h-1 w-16 rounded-full bg-gradient-to-r from-blue-800 to-blue-500' />
                </div>

                <div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4'>
                    {categories.map((item, index) => {
                        const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

                        return (
                            <Link
                                key={index}
                                to="Shope"
                                className={`group flex flex-col items-center rounded-2xl bg-white p-4 shadow-md ring-1 ring-blue-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${color.ring}`}
                            >
                                {/* Image */}
                                <div
                                    className={`flex aspect-square w-full items-center justify-center overflow-hidden rounded-xl p-4 ${color.bg}`}
                                >
                                    <img
                                        src={item.img}
                                        alt={item.title}
                                        className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                                    />
                                </div>

                                {/* Title + arrow */}
                                <div
                                    className={`mt-3 flex items-center gap-2 font-semibold ${color.text}`}
                                >
                                    <span className='text-sm sm:text-base'>{item.title}</span>
                                    <FaArrowRight
                                        className='transition-transform duration-300 group-hover:translate-x-1'
                                        size={16}
                                    />
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* সার্ভিস সেকশন (হোম সার্ভিস + সার্ভিসিং সেন্টার) */}
            <div className='flex w-full flex-col gap-6 lg:w-1/2'>
                {services.map((service) => (
                    <Link
                        key={service.to}
                        to={service.to}
                        className='group flex flex-col overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-blue-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:ring-blue-300'
                    >
                        {/* Image */}
                        <div className='relative w-full overflow-hidden'>
                            <img
                                src={service.img}
                                alt={service.alt}
                                className='h-48 w-full object-cover transition-transform duration-500 group-hover:scale-105 sm:h-56 md:h-60 lg:h-[240px]'
                            />
                            <div className='absolute inset-0 bg-gradient-to-t from-blue-950/40 via-transparent to-transparent' />
                        </div>

                        {/* Text */}
                        <div className='flex flex-1 flex-col px-5 pb-5 pt-4'>
                            <h2 className='text-lg font-bold leading-snug text-[#0f1f4b] sm:text-xl'>
                                {service.title}
                            </h2>
                            <p className='py-2 text-xs text-gray-600 sm:text-sm'>
                                {service.text}
                            </p>

                            <span className='mt-auto inline-flex w-fit items-center gap-2 rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-200 transition-all duration-300 group-hover:from-blue-900 group-hover:to-blue-700'>
                                সার্ভিস বুক করুন
                                <FaArrowRight
                                    className='transition-transform duration-300 group-hover:translate-x-1'
                                    size={14}
                                />
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Categroy;