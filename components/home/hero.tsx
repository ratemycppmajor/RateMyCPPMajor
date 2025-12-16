'use client';
import React from 'react';
import { Input } from "@/components/ui/input"
import HomeNavbar from '../home-navbar';
import { useState } from 'react';

const Hero = () => {
  const [value, setValue] = useState('')

  return (
    <div className="text-primary" style={{background: "linear-gradient(0deg,rgba(255, 255, 255, 1) 40%, rgba(255, 184, 28, 1) 60%, rgba(164, 214, 94, 1) 100%)"}}>
      <HomeNavbar />
            
      <div className="mx-auto max-w-7xl flex-col px-6 py-20 flex lg:items-center gap-16 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:shrink-0">
          <h1 className="mt-10 text-4xl font-bold sm:text-6xl text-center">
            Your Gateway to
          </h1>
          
          <span className='text-4xl font-bold sm:text-6xl text-center block'>CPP Major Insights</span>
          <p className="mt-6 text-xl leading-8 font-medium text-center">
            Student reviews and ratings for CPP majors.
          </p>
        </div>

        <div className="lg:w-2xl w-96 mx-auto">
          <Input 
            type="search" 
            placeholder="Search..." 
            className="px-6 py-5 bg-white border-primary [&::-webkit-search-cancel-button]:appearance-none"
            value={value}
            onChange={e => setValue(e.target.value)}
            aria-label="CPP Major Search Input"
          />
        </div>

        <div className="mx-auto mt-16 lg:mt-0">
          <video
            playsInline
            loop
            autoPlay
            muted
            className="
              relative z-10 w-full 
              rounded-[20px] 
              object-cover 
              bg-transparent 
              cursor-auto 
              shadow-[0_0_20px_10px_rgba(164,214,94,0.5)] 
              object-center
              block
            "
          >
            <source src="/videos/sample.mp4" type="video/mp4" />
          </video>
        </div>

      </div>
    </div>
  );
};

export default Hero;
