"use client";

import React from 'react';
import Image from 'next/image';
import logo from './legallogo.jpg';
import tclogo from './tclogo.png';

const HomeHeader = () => {
  return (
    <header className="bg-white   relative">
  {/* Top accent line */}
  <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-red-500 w-full"></div>
  
  <div className="container mx-auto px-4 max-w-5xl">
    <div className="flex flex-col items-center justify-center py-6">
      {/* Logo - Centered with padding */}
      <div className="mb-2">
        <Image 
          src={logo}
          alt="Legal Clinic Logo" 
          width={400}
          height={400}
          className="object-contain"
          priority
        />
      </div>

      {/* Powered by section - Enhanced styling */}
      <div className="flex items-center space-x-3  px-4 py-2  ">
        <span className="text-gray-500 text-sm font-medium">Developed by</span>
        <Image 
          src={tclogo}
          alt="TC Logo" 
          width={110}
          height={110}
          className="object-contain"
          priority
        />
      </div>
    </div>
  </div>
</header>
  );
};

export default HomeHeader; 
