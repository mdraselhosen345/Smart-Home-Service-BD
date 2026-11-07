import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import Logo from '../../../components/Logo/Logo';
import { IoSearchOutline } from "react-icons/io5";
import Acount from "../../../assets/Acount.png";

const NavBar = () => {
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();

        const value = search.trim();

        if (value) {
            navigate(`/shope?search=${encodeURIComponent(value)}`);
        }
    };

    return (
        <nav className="relative flex items-center justify-between gap-3 bg-gradient-to-r from-[#000047] via-[#0a0a5c] to-[#000047] px-4 py-2 shadow-lg">

            {/* Logo */}
            <div className="z-10 shrink-0">
                <Logo />
            </div>

            {/* Search (মোবাইলে পাশে, ডেস্কটপে মাঝখানে) */}
            <form
                onSubmit={handleSearch}
                role="search"
                className="relative w-40 sm:w-56 md:absolute md:left-1/2 md:w-full md:max-w-md md:-translate-x-1/2 md:px-4"
            >
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search products..."
                        aria-label="Search products"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="h-11 w-full rounded-full border-2 border-transparent bg-white pl-4 pr-14 text-sm text-gray-800 placeholder-gray-400 shadow-inner outline-none transition focus:border-[#F5B027] focus:ring-4 focus:ring-[#F5B027]/30"
                    />

                    <button
                        type="submit"
                        aria-label="Search products"
                        className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-[#F5B027] text-[#000047] shadow-md transition-all duration-300 hover:scale-110 hover:bg-[#ffc94d] hover:shadow-lg active:scale-95"
                    >
                        <IoSearchOutline size={20} />
                    </button>
                </div>
            </form>

            {/* Account */}
            <div className="z-10 shrink-0">
                <Link
                    to="/account"
                    aria-label="My Account"
                    className="group block rounded-full p-1 ring-2 ring-[#F5B027]/60 transition-all duration-300 hover:scale-105 hover:bg-white/10 hover:ring-[#F5B027] hover:shadow-lg hover:shadow-[#F5B027]/30"
                >
                    <img
                        src={Acount}
                        className="h-10 w-10 rounded-full bg-white object-contain p-0.5 transition-transform duration-300 group-hover:rotate-6"
                        alt="Account"
                    />
                </Link>
            </div>

        </nav>
    );
};

export default NavBar;