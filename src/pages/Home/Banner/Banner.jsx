import React from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

import PCService from "../../../assets/ServiceBackground/PcService.png"
import CCTVBac from '../../../assets/ServiceBackground/CCTVBAC.png'
import Electronic from '../../../assets/ServiceBackground/ElectronicService.png'
const Banner = () => {
    return (
        <Carousel 
              autoPlay 
              infiniteLoop 
              showThumbs={false}
         >
            {/* card 1 */}
  <div className="relative h-[400px]">
    <img src={PCService} className="w-full h-full object-cover" />

<div className="absolute inset-0 flex items-center">
  <div className="pl-6 md:pl-12 lg:pl-20 text-left">
    <h1 className="lg:text-4xl text-xl font-bold text-white mb-3">
      আপনার বিশ্বস্ত ইলেকট্রনিক্স পার্টনার
    </h1>

    <h2 className="lg:text-2xl text-base text-white mb-6">
      সব ধরনের ইলেকট্রনিক্স পণ্য এবং <br />
      অরিজিনাল যন্ত্রাংশ
    </h2>

    <button className="btn btn-warning">
      এখনই কিনুন
    </button>
  </div>
</div>
  </div>
         {/* card 2 */}
          <div className="relative h-[400px]">
    <img src={Electronic} className="w-full h-full object-cover" />

<div className="absolute inset-0 flex items-center">
  <div className="pl-6 md:pl-12 lg:pl-20 text-left">
    <h1 className="lg:text-4xl text-2xl font-bold text-white mb-3">     
         দ্রুত ও নির্ভরযোগ্য সার্ভিসিং
    </h1>

    <h2 className="lg:text-2xl text-base text-white mb-6">
       বাসায় গিয়ে দ্রুত ও নির্ভরযোগ্য সার্ভিস।
    </h2>

    <button className="btn btn-warning">
      সার্ভিস বুক করুন
    </button>
  </div>
</div>
         </div>

     {/* card 3 */}
  <div className="relative h-[400px]">
    <img src={CCTVBac} className="w-full h-full object-cover" />

<div className="absolute inset-0 flex items-center">
  <div className="pl-6 md:pl-12 lg:pl-20 text-left">
    <h1 className="lg:text-4xl text-xl font-bold text-white mb-3">
      আপনার বিশ্বস্ত ইলেকট্রনিক্স পার্টনার
    </h1>

    <h2 className="lg:text-2xl text-base text-white mb-6">
      সব ধরনের ইলেকট্রনিক্স পণ্য এবং <br />
      অরিজিনাল যন্ত্রাংশ
    </h2>

    <button className="btn btn-warning">
      এখনই কিনুন
    </button>
  </div>
</div>
  </div>
    {/* card 4 */}
  <div className="relative h-[400px]">
    <img src={Electronic} className="w-full h-full object-cover" />

<div className="absolute inset-0 flex items-center">
  <div className="pl-6 md:pl-12 lg:pl-20 text-left">
    <h1 className="lg:text-4xl text-2xl font-bold text-white mb-3">     
         দ্রুত ও নির্ভরযোগ্য সার্ভিসিং
    </h1>

    <h2 className="lg:text-2xl text-base text-white mb-6">
       বাসায় গিয়ে দ্রুত ও নির্ভরযোগ্য সার্ভিস।
    </h2>

    <button className="btn btn-warning">
      সার্ভিস বুক করুন
    </button>
  </div>
</div>
  </div>
</Carousel>
          

    );
};

export default Banner;