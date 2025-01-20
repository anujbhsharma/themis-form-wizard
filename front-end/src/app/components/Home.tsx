"use client"
import React from 'react';
import Image from 'next/image';
import logo from './logo.png';
import tclogo from './tclogo.png'

const HomeHeader = () => {
  return (
    <header className="relative bg-white border-b border-gray-100 rounded-lg shadow-md">
      <div className="container mx-auto px-8">
        <div className="flex items-center justify-between h-24">
          {/* Left Section */}
          <div className="flex-1 flex items-center justify-start">
            <div className="text-sm text-gray-600">
              Accessible Legal Services
            </div>
          </div>

          {/* Centered Logo and Title */}
          <div className="flex items-center gap-3">
            <div className="relative w-16 h-16 transition-transform duration-300 hover:scale-105">
              
            </div>
            <div className="flex flex-col items-center">
              <h1 className="text-xl font-bold text-gray-900">
                Legal Clinic
              </h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-px w-8 bg-gradient-to-r from-transparent via-red-200 to-transparent"></span>
                <Image 
                src={logo}
                alt="UNB Legal Clinic Logo" 
                width={64}
                height={64}
                className="object-contain filter brightness-0"
                priority
              />
                <span className="h-px w-8 bg-gradient-to-r from-transparent via-red-200 to-transparent"></span>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-1 flex items-center justify-end">
            <div className="flex items-center text-sm">
              <span className="text-gray-500 font-bold">Powered by</span>
              <Image 
                src={tclogo}
                alt="UNB Legal Clinic Logo" 
                width={128}
                height={128}
                className="object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-50/10 to-transparent"></div>
      </div>
    </header>
  );
};

export default HomeHeader;