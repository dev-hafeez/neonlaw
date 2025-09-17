"use client";

import { useEffect, useState } from 'react';

export default function ScrollIcon() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Hide icon when scrolled down more than 100px
      if (scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div 
      id="scroll-icon" 
      className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div className="w-5 h-8 border-2 border-white rounded-full flex justify-center relative">
        <div className="w-1 h-1.5 bg-white rounded-full mt-2 animate-bounce"></div>
      </div>
    </div>
  );
}
