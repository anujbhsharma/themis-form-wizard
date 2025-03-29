// "use client";

// import React from 'react';
// import Image from 'next/image';
// import logo from './legallogo.jpg';
// import tclogo from './tclogo.png';

// const HomeHeader = () => {
//   return (
//     <header className="bg-white   relative">
//   {/* Top accent line */}
//   <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-red-500 w-full"></div>
  
//   <div className="container mx-auto px-4 max-w-5xl">
//     <div className="flex flex-col items-center justify-center py-6">
//       {/* Logo - Centered with padding */}
//       <div className="mb-2">
//         <Image 
//           src={logo}
//           alt="Legal Clinic Logo" 
//           width={400}
//           height={400}
//           className="object-contain"
//           priority
//         />
//       </div>

//       {/* Powered by section - Enhanced styling */}
//       <div className="flex items-center space-x-3  px-4 py-2  ">
//         <span className="text-gray-500 text-sm font-medium">Developed by</span>
//         <Image 
//           src={tclogo}
//           alt="TC Logo" 
//           width={110}
//           height={110}
//           className="object-contain"
//           priority
//         />
//       </div>
//     </div>
//   </div>
// </header>
//   );
// };

// export default HomeHeader; 
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import defaultLogo from './legallogo.jpg'; // Keep as fallback
import tclogo from './tclogo.png';

const HomeHeader = () => {
  const [logoSrc, setLogoSrc] = useState(defaultLogo);
  const [isCustomLogo, setIsCustomLogo] = useState(false);

  useEffect(() => {
    // Fetch the content data to get the logo URL
    const fetchLogoUrl = async () => {
      try {
        const response = await fetch('/api/content');
        if (response.ok) {
          const data = await response.json();
          if (data.clinicInfo?.logoUrl) {
            setLogoSrc(data.clinicInfo.logoUrl);
            setIsCustomLogo(true);
          }
        }
      } catch (error) {
        console.error('Error fetching logo URL:', error);
        // Keep using the default logo in case of error
      }
    };

    fetchLogoUrl();
  }, []);

  return (
    <header className="bg-white relative">
      {/* Top accent line */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-blue-500 to-red-500 w-full"></div>
      
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col items-center justify-center py-6">
          {/* Logo - Keeping original styling */}
          <div className="mb-2">
            {isCustomLogo ? (
              // For dynamically loaded logo from public folder
              <Image 
                src={logoSrc}
                alt="Legal Clinic Logo" 
                width={400}
                height={400}
                className="object-contain"
                priority
              />
            ) : (
              // For the imported default logo
              <Image 
                src={logoSrc}
                alt="Legal Clinic Logo" 
                width={400}
                height={400}
                className="object-contain"
                priority
              />
            )}
          </div>

          {/* Powered by section - unchanged */}
          <div className="flex items-center space-x-3 px-4 py-2">
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