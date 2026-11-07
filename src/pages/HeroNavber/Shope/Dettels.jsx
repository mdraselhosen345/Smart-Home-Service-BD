import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router';
import {
    FaArrowLeft,
    FaStar,
    FaShoppingCart,
    FaBolt,
    FaShieldAlt,
    FaTruck,
    FaInfoCircle,
    FaCheckCircle,
} from 'react-icons/fa';

const API_URL = 'http://localhost:5000/api/products';

// Warranty / Delivery / Details এর আইকন
const INFO_ICONS = {
    Warranty: { Icon: FaShieldAlt, circle: 'bg-green-100 text-green-600' },
    Delivery: { Icon: FaTruck, circle: 'bg-orange-100 text-orange-500' },
    Details: { Icon: FaInfoCircle, circle: 'bg-blue-100 text-blue-700' },
};

const cardClass = 'rounded-3xl bg-white shadow-xl ring-1 ring-blue-100';

const Dettels = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState('');

    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();

        const loadProduct = async () => {
            try {
                setLoading(true);
                setError('');

                const response = await fetch(API_URL, {
                    signal: controller.signal,
                });

                if (!response.ok) {
                    throw new Error('Product load failed');
                }

                const result = await response.json();

                if (!Array.isArray(result.data)) {
                    throw new Error('Invalid product data');
                }

                const singleProduct = result.data.find(
                    (item) => String(item._id || item.id) === String(id)
                );

                if (!singleProduct) {
                    setProduct(null);
                    setError('এই প্রোডাক্টটি পাওয়া যায়নি।');
                    return;
                }

                setProduct(singleProduct);
                setSelectedImage(
                    singleProduct.thumbnail ||
                        singleProduct.images?.[0] ||
                        singleProduct.image ||
                        ''
                );
            } catch (err) {
                if (err.name !== 'AbortError') {
                    console.error('Product loading error:', err);
                    setError('প্রোডাক্ট লোড করা যাচ্ছে না। Backend পরীক্ষা করুন।');
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        loadProduct();

        return () => controller.abort();
    }, [id]);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-100 via-blue-50 to-white">
                <div className="flex items-center gap-4 rounded-2xl bg-white px-8 py-6 shadow-xl ring-1 ring-blue-100">
                    <span className="h-8 w-8 animate-spin rounded-full border-4 border-blue-200 border-t-blue-700" />
                    <h1 className="text-xl font-bold text-[#0f1f4b]">
                        প্রোডাক্ট লোড হচ্ছে...
                    </h1>
                </div>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-gradient-to-b from-sky-100 via-blue-50 to-white px-4">
                <div className="rounded-2xl bg-white px-8 py-6 text-center shadow-xl ring-1 ring-red-100">
                    <h1 className="text-xl font-bold text-red-600">
                        {error || 'প্রোডাক্ট পাওয়া যায়নি।'}
                    </h1>
                </div>

                <Link
                    to="/shope"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg shadow-blue-200 transition hover:from-blue-900 hover:to-blue-700"
                >
                    <FaArrowLeft />
                    Shop-এ ফিরে যান
                </Link>
            </div>
        );
    }

    const specifications =
        product.specifications &&
        typeof product.specifications === 'object' &&
        !Array.isArray(product.specifications)
            ? product.specifications
            : {};

    // সব ছবির তালিকা (ডুপ্লিকেট বাদ দিয়ে)
    const allImages = [
        ...new Set(
            [
                product.thumbnail,
                ...(Array.isArray(product.images) ? product.images : []),
                product.image,
            ].filter(Boolean)
        ),
    ];

    const productName = product.title || product.name || 'Product';

    const stockNumber = Number(product.stock);
    const stockKnown = product.stock != null && !Number.isNaN(stockNumber);
    const inStock = stockKnown && stockNumber > 0;

    const infoItems = [
        ['Warranty', product.warranty],
        ['Delivery', product.delivery],
        ['Details', product.details],
    ].filter(([, value]) => value != null && value !== '');

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-100 via-blue-50 to-white px-4 py-8 md:py-12">
            <div className="mx-auto max-w-6xl">
                {/* Back link */}
                <Link
                    to="/shope"
                    className="mb-5 inline-flex items-center gap-2 font-semibold text-blue-800 hover:underline"
                >
                    <FaArrowLeft className="text-sm" />
                    Shop-এ ফিরে যান
                </Link>

                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    {/* ---------- Left: Product Image ---------- */}
{/* ---------- Left: Product Image ---------- */}
<div className="self-start lg:sticky lg:top-6">
    {/* Main image */}
    <div className="group relative aspect-square overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-blue-100">
        {selectedImage ? (
            <img
                src={selectedImage}
                alt={productName}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
        ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-sky-100 to-blue-50">
                <p className="text-gray-500">কোনো Product Image নেই</p>
            </div>
        )}

        {/* Discount badge */}
        {selectedImage && product.discount != null && (
            <span className="absolute left-4 top-4 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white shadow-lg">
                {product.discount}% OFF
            </span>
        )}

        {/* Image counter */}
        {allImages.length > 1 && (
            <span className="absolute bottom-4 right-4 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                {Math.max(allImages.indexOf(selectedImage), 0) + 1} / {allImages.length}
            </span>
        )}
    </div>

    {/* Small Image Gallery */}
    {allImages.length > 1 && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
            {allImages.map((img, index) => (
                <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl shadow-md transition hover:-translate-y-1 hover:shadow-lg ${
                        selectedImage === img
                            ? 'ring-4 ring-blue-600'
                            : 'opacity-70 ring-1 ring-blue-100 hover:opacity-100'
                    }`}
                >
                    <img
                        src={img}
                        alt={`${productName} ${index + 1}`}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                    />
                </button>
            ))}
        </div>
    )}
</div>
                    {/* ---------- Right: Product Information ---------- */}
                    <div className={`${cardClass} space-y-5 p-6 md:p-8`}>
                        <h1 className="text-2xl font-bold leading-snug text-[#0f1f4b] md:text-3xl">
                            {productName}
                        </h1>

                        <div className="flex flex-wrap gap-2">
                            {product.brand && (
                                <span className="rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-800">
                                    Brand: {product.brand}
                                </span>
                            )}

                            <span className="rounded-full bg-indigo-100 px-4 py-1.5 text-sm font-semibold text-indigo-800">
                                Category: {product.category || 'N/A'}
                            </span>
                        </div>

                        {(product.rating != null || product.reviews != null) && (
                            <p className="flex items-center gap-2 font-semibold text-yellow-500">
                                <FaStar />
                                <span className="text-gray-700">
                                    {product.rating ?? 'N/A'}
                                </span>
                                <span className="text-sm font-normal text-gray-500">
                                    ({product.reviews ?? 0} Reviews)
                                </span>
                            </p>
                        )}

                        {/* Price box */}
                        <div className="rounded-2xl bg-blue-50 p-5 ring-1 ring-blue-100">
                            {product.discount != null && (
                                <span className="mb-2 inline-block rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                                    {product.discount}% OFF
                                </span>
                            )}

                            <div className="flex flex-wrap items-end gap-3">
                                <h2 className="text-3xl font-bold text-[#E35335]">
                                    ৳ {product.price ?? 'N/A'}
                                </h2>

                                {product.oldPrice != null && (
                                    <p className="pb-1 text-lg text-gray-500 line-through">
                                        ৳ {product.oldPrice}
                                    </p>
                                )}
                            </div>
                        </div>

                        {product.stock != null && (
                            <p className="flex items-center gap-2">
                                <span className="text-gray-700">Stock:</span>
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ${
                                        !stockKnown
                                            ? 'bg-gray-100 text-gray-700'
                                            : inStock
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-red-100 text-red-700'
                                    }`}
                                >
                                    {stockKnown && inStock && <FaCheckCircle />}
                                    {product.stock}
                                </span>
                            </p>
                        )}

                        {Array.isArray(product.features) &&
                            product.features.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {product.features.map((feature, index) => (
                                        <span
                                            key={index}
                                            className="rounded-lg bg-teal-50 px-3 py-1.5 text-sm text-teal-800 ring-1 ring-teal-100"
                                        >
                                            {feature}
                                        </span>
                                    ))}
                                </div>
                            )}

                        {product.description && (
                            <p className="leading-relaxed text-gray-600">
                                {product.description}
                            </p>
                        )}

                        <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                            <button
                                type="button"
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-800 to-blue-600 px-5 py-3.5 text-lg font-semibold text-white shadow-lg shadow-blue-200 transition hover:from-blue-900 hover:to-blue-700"
                            >
                                <FaShoppingCart />
                                Add to Cart
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(`/checkout/${product._id || product.id}`)
                                }
                                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400 px-5 py-3.5 text-lg font-semibold text-white shadow-lg shadow-orange-200 transition hover:from-orange-600 hover:to-orange-500"
                            >
                                <FaBolt />
                                Buy Now
                            </button>
                        </div>
                    </div>
                </div>

                {/* ---------- Additional Product Information ---------- */}
                <div className="mx-auto mt-10 max-w-3xl space-y-6">
                    {infoItems.length > 0 && (
                        <ul className="space-y-3">
                            {infoItems.map(([label, value]) => {
                                const { Icon, circle } = INFO_ICONS[label];
                                return (
                                    <li
                                        key={label}
                                        className="flex items-start gap-4 rounded-2xl bg-white p-4 shadow-md ring-1 ring-blue-100"
                                    >
                                        <div
                                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg ${circle}`}
                                        >
                                            <Icon />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-lg font-bold text-[#0f1f4b]">
                                                {label}
                                            </p>
                                            <p className="break-words text-gray-600">
                                                {value}
                                            </p>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    )}

                    {Object.keys(specifications).length > 0 && (
                        <div className="overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-blue-100">
                            <h2 className="bg-gradient-to-r from-blue-900 to-blue-800 px-5 py-3 text-xl font-bold text-white">
                                Specifications
                            </h2>

                            <table className="w-full text-left">
                                <tbody>
                                    {Object.entries(specifications).map(
                                        ([key, value], index) => (
                                            <tr
                                                key={key}
                                                className={
                                                    index % 2 === 0
                                                        ? 'bg-blue-50/60'
                                                        : 'bg-white'
                                                }
                                            >
                                                <td className="w-1/3 px-5 py-3 font-bold text-[#0f1f4b]">
                                                    {key}
                                                </td>
                                                <td className="px-5 py-3 text-gray-700">
                                                    {typeof value === 'object'
                                                        ? JSON.stringify(value)
                                                        : String(value)}
                                                </td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div className="rounded-2xl bg-white p-6 shadow-md ring-1 ring-blue-100">
                        <h2 className="text-xl font-bold text-[#0f1f4b]">
                            Description
                        </h2>
                        <div className="mt-2 h-1 w-14 rounded-full bg-gradient-to-r from-blue-800 to-blue-500" />

                        <p className="mt-4 leading-relaxed text-gray-700">
                            {product.description || 'কোনো Description দেওয়া হয়নি।'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dettels;