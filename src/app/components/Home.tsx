"use client"
import React from 'react';
import Image from 'next/image';
import logo from './logo.png'
const HomeHeader: React.FC = () => {
  return (
    <header className="relative overflow-hidden py-12 px-4 text-center md:py-16 ">
  <div className="max-w-4xl mx-auto">
    {/* Logo and Title Section */}
    <div className="flex flex-col items-center justify-center gap-4 mb-6">
    <div className="relative w-64  md:w-80 ">
            <Image 
              src={logo}
              alt="UNB Legal Clinic Logo" 
              width={320} 
              height={320}
              className="object-contain filter brightness-0"
            />
          </div>
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 tracking-tight">
        Legal Clinic
      </h1>
    </div>

    {/* Divider */}
    <div className="flex items-center justify-center gap-4 mb-8">
      <span className="h-[1px] w-12 bg-red-200"></span>
      <p className="text-red-600 font-medium">
        Powered by Themiscore
      </p>
      <span className="h-[1px] w-12 bg-red-200"></span>
    </div>

    {/* Description */}
    <div className="max-w-2xl mx-auto">
      <p className="text-gray-600 text-lg md:text-xl leading-relaxed">
        Providing accessible legal services to our community through supervised law students
      </p>
    </div>

    {/* Decorative Background Elements */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl">
      <div className="absolute inset-0 bg-[radial-gradient(closest-side,rgba(255,0,0,0.03),transparent)] pointer-events-none"></div>
    </div>
  </div>
</header>
  );
};

export default HomeHeader;