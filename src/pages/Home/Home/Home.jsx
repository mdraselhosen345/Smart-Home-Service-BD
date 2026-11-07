import React from 'react';
import Banner from '../Banner/Banner';
import Brands from '../Brands/Brands';
import Categroy from '../Category/Category';


const Home = () => {
    return (
        <div className='max-w-6xl mx-auto'>
            <Banner></Banner>
            <Brands></Brands>
            <Categroy></Categroy>
        </div>
    );
};

export default Home;