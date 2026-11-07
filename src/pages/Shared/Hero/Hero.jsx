import React from 'react';
import { NavLink } from 'react-router';
import {
    FaStore,
    FaTools,
    FaHome,
    FaInfoCircle,
    FaPhoneAlt,
} from 'react-icons/fa';

const LINKS = [
    { to: '/Shope', label: 'SHOPE', Icon: FaStore },
    { to: '/Servecing', label: 'SERVICING', Icon: FaTools },
    { to: '/Homeservice', label: 'HOME SERVICE', Icon: FaHome },
    { to: '/AboutUs', label: 'ABOUTS US', Icon: FaInfoCircle },
    { to: '/Contact', label: 'CONTACT', Icon: FaPhoneAlt },
];

const Hero = () => {
    return (
        <nav className="w-full bg-[#F5DEB3] shadow-sm">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-1 px-2 py-2 md:justify-center md:gap-3 md:px-4">
                {LINKS.map(({ to, label, Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl px-2.5 py-2.5 text-center text-[10px] font-semibold transition-all duration-300 ease-out active:scale-95 sm:text-xs md:px-4 md:text-base lg:px-5 lg:py-3 lg:text-lg ${
                                isActive
                                    ? 'bg-[#E35335] text-white shadow-lg shadow-[#E35335]/40'
                                    : 'text-black hover:-translate-y-1 hover:bg-[#E35335] hover:text-white hover:shadow-lg hover:shadow-[#E35335]/40'
                            }`
                        }
                    >
                        {/* হোভারে হালকা আলোর ঝলক */}
                        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                        <Icon className="relative hidden transition-transform duration-300 group-hover:-rotate-12 group-hover:scale-125 md:inline-block" />
                        <span className="relative">{label}</span>
                    </NavLink>
                ))}
            </div>
        </nav>
    );
};

export default Hero;