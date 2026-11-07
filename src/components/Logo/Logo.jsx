import React from 'react';
import { Link } from 'react-router';
import logo from '../../assets/logo.png'

const Logo = () => {
    return (
        <Link to="/" className="group inline-block" aria-label="হোম পেজে যান">
            <div className="flex h-14 w-15 items-center justify-center overflow-hidden rounded-xl bg-white p-1 shadow-md ring-1 ring-black/5 transition-all duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-hover:shadow-lg group-hover:ring-2 group-hover:ring-[#E35335]/60 group-active:scale-95 sm:h-[70px] sm:w-[100px]">
                <img
                    src={logo}
                    alt="Logo"
                    className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
                />
            </div>
        </Link>
    );
};

export default Logo;