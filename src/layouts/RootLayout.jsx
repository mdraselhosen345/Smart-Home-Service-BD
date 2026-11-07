import React from 'react';
import NavBar from '../pages/Shared/NavBar/NavBar';
import { Outlet } from 'react-router';
import Footer from '../pages/Shared/Footer/Footer';
import Hero from '../pages/Shared/Hero/Hero';


const RootLayout = () => {
    return (
        <div className='max-w-7xl mx-auto'>
              <NavBar></NavBar>
              <Hero></Hero>
              <Outlet></Outlet>
              <Footer></Footer>
        </div>
    );
};

export default RootLayout;