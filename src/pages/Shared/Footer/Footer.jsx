import React from 'react';
import Logo from '../../../components/Logo/Logo';


const Footer = () => {
    return (
        <footer className="footer footer-horizontal footer-center  bg-[#000047] text-base-content rounded p-10">
       <div className='h-[80px] w-[80px]'>
        <Logo ></Logo>
       </div>

    <nav className="grid grid-flow-col gap-4 text-white">
    <a className="link link-hover">About us</a>
    <a className="link link-hover">Contact</a>
    <a className="link link-hover">Jobs</a>
    <a className="link link-hover">Press kit</a>
  </nav>
  <aside className='text-white'>
    <p>Copyright © {new Date().getFullYear()} - All right reserved by ACME Industries Ltd</p>
  </aside>
</footer>
    );
};

export default Footer;