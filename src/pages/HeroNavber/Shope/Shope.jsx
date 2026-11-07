import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { FaStar, FaArrowRight, FaSearch } from 'react-icons/fa';

const Shope = () => {
    const [shope, setShope] = useState([]);
    const [loading, setLoading] = useState(true);

    // Navbar থেকে Search value নেওয়া
    const [searchParams] = useSearchParams();
    const search = searchParams.get('search') || '';

    // API থেকে Product Load
    useEffect(() => {
        fetch('http://localhost:5000/api/products')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Product load failed');
                }
                return res.json();
            })
            .then((result) => {
                setShope(result.data || []);
            })
            .catch((error) => {
                console.error('Product loading error:', error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    // Search অনুযায়ী Product Filter
    const filteredShope = shope.filter((item) =>
        (item.name || item.title || '')
            .toLowerCase()
            .includes(search.trim().toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-white px-4 py-8 md:py-10">
            <div className="mx-auto max-w-7xl">

                {/* Heading */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-[#0f1f4b] md:text-3xl">
                        আমাদের প্রোডাক্ট
                    </h1>
                    <div className="mx-auto mt-3 h-1 w-20 rounded-full bg-gradient-to-r from-blue-800 to-blue-500" />
                </div>

                {/* Search Result Title */}
                {search.trim() !== '' && (
                    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 shadow-md ring-1 ring-blue-100">
                        <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                                <FaSearch />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-[#0f1f4b]">
                                    Search Result: {search}
                                </h2>
                                <p className="text-sm text-gray-600">
                                    পাওয়া গেছে: {filteredShope.length} টি প্রোডাক্ট
                                </p>
                            </div>
                        </div>

                        <Link
                            to="/shope"
                            className="text-sm font-semibold text-blue-700 hover:underline"
                        >
                            সব প্রোডাক্ট দেখুন
                        </Link>
                    </div>
                )}

                {/* Loading Message */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="flex items-center gap-4 rounded-2xl bg-white px-8 py-6 shadow-xl ring-1 ring-blue-100">
                            <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />
                            <p className="text-lg font-bold text-[#0f1f4b]">
                                প্রোডাক্ট লোড হচ্ছে...
                            </p>
                        </div>
                    </div>
                ) : (

                    /* Product Grid */
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

                        {filteredShope.length > 0 ? (

                            filteredShope.map((item) => {
                                const image =
                                    item.thumbnail || item.images?.[0] || item.image;
                                const name = item.title || item.name;

                                return (
                                    <Link
                                        key={item._id || item.id}
                                        to={`/shope/${item._id || item.id}`}
                                        className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-blue-100 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:ring-blue-300"
                                    >

                                        {/* Product Image */}
                                        <div className="relative aspect-square overflow-hidden bg-blue-50">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    referrerPolicy="no-referrer"
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                    alt={name || 'Product'}
                                                />
                                            ) : (
                                                <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                                                    ছবি নেই
                                                </div>
                                            )}

                                            {item.discount != null && (
                                                <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white shadow-md">
                                                    {item.discount}% OFF
                                                </span>
                                            )}
                                        </div>

                                        {/* Product Details */}
                                        <div className="flex flex-1 flex-col p-3">

                                            <h1 className="min-h-[2.5rem] line-clamp-2 text-[14px] font-bold leading-snug text-[#0f1f4b]">
                                                {name}
                                            </h1>

                                            {/* Rating and Reviews */}
                                            {(item.rating != null || item.reviews != null) && (
                                                <div className="mt-2 flex items-center justify-between">
                                                    <div className="flex items-center gap-1 text-yellow-500">
                                                        <FaStar className="text-sm" />
                                                        <span className="text-[13px] font-medium text-gray-700">
                                                            {item.rating}
                                                        </span>
                                                    </div>

                                                    {item.reviews != null && (
                                                        <h3 className="text-[13px] font-semibold text-gray-500">
                                                            ({item.reviews})
                                                        </h3>
                                                    )}
                                                </div>
                                            )}

                                            {/* Price */}
                                            <div className="mt-2 flex flex-wrap items-end gap-2">
                                                <h1 className="text-xl font-bold text-[#E35335]">
                                                    ৳ {item.price}
                                                </h1>

                                                {item.oldPrice != null && (
                                                    <span className="pb-0.5 text-sm text-gray-400 line-through">
                                                        ৳ {item.oldPrice}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Details Button */}
                                            <span className="mt-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-blue-200 transition-all duration-300 group-hover:from-blue-900 group-hover:to-blue-700">
                                                বিস্তারিত দেখুন
                                                <FaArrowRight className="text-xs" />
                                            </span>

                                        </div>

                                    </Link>
                                );
                            })

                        ) : (

                            /* No Product Found */
                            <div className="col-span-full py-10">
                                <div className="mx-auto max-w-md rounded-3xl bg-white px-6 py-10 text-center shadow-xl ring-1 ring-blue-100">
                                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-700">
                                        <FaSearch />
                                    </div>

                                    <h2 className="mt-4 text-xl font-bold text-[#0f1f4b]">
                                        কোনো প্রোডাক্ট পাওয়া যায়নি!
                                    </h2>

                                    <p className="mt-2 text-gray-500">
                                        অন্য নাম দিয়ে সার্চ করে দেখুন।
                                    </p>

                                    <Link
                                        to="/shope"
                                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:from-blue-900 hover:to-blue-700"
                                    >
                                        সব প্রোডাক্ট দেখুন
                                        <FaArrowRight className="text-sm" />
                                    </Link>
                                </div>
                            </div>

                        )}

                    </div>
                )}

            </div>
        </div>
    );
};

export default Shope;