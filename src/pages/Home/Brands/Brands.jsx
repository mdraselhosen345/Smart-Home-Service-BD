import React from 'react';
import Delivery from "../../../assets/Brands/delivery.png"
import Technician from "../../../assets/Brands/technician.png"
import Original from "../../../assets/Brands/original.png"
import Pyment from "../../../assets/Brands/pyment.png"

const Brands = () => {
    return (
        <div className=''>
            <div className='grid lg:grid-cols-4 grid-cols-2 justify-between py-6 px-8 gap-5'>
                <div className='flex gap-1 justify-center items-center bg-[#FF7F50] px-8 py-4 shadow-2xl rounded-xl'>
                     <img src={Delivery} className='h-[40px] w-[40px]' alt="" />
                    <h1 className='lg:text-base md:text-base text-[10px] font-bold'>সারাদেশে ডেলিভারি</h1>
                </div>
                <div className='flex gap-1 justify-center items-center bg-[#FF7F50] px-8 py-4 shadow-2xl rounded-xl'>
                    <img src={Technician} className='h-[40px] w-[40px]' alt="" />
                    <h1 className='lg:text-base md:text-base text-[10px] font-bold '>অভিজ্ঞ টেকনিশিয়ান</h1>
                </div>
                <div className='flex gap-1 justify-center items-center px-8 py-4 bg-[#FF7F50] shadow-2xl rounded-xl'>
                    <img src={Original} className='h-[40px] w-[40px]' alt="" />
                    <h1 className='lg:text-base md:text-base text-[10px] font-bold '>অরিজিনাল যন্ত্রাংশ</h1>
                </div>
                <div className='flex gap-1 justify-center items-center px-8 py-4 bg-[#FF7F50] shadow-2xl rounded-xl'>
                    <img src={Pyment} className='h-[40px] w-[40px]' alt="" />
                    <h1 className='lg:text-base md:text-base text-[10px] font-bold '>সহজ পেমেন্ট</h1>
                </div>
            </div>
        </div>
    );
};

export default Brands;