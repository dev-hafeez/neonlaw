import React from 'react';
import Link from 'next/link';

const PageFooter: React.FC = () => (
  <footer className="bg-white border-t border-gray-200 py-4">
    <div className="w-full px-12">
      <nav className="flex justify-end items-center gap-6">
        <Link 
          href="/contact" 
          className="text-[#0a72bd] text-sm hover:text-blue-600 transition-colors"
        >
          Contact
        </Link>
        <Link 
          href="/imprint" 
          className="text-[#0a72bd] text-sm hover:text-blue-600 transition-colors"
        >
          Imprint
        </Link>
        <Link 
          href="/data-protection" 
          className="text-[#0a72bd] text-sm hover:text-blue-600 transition-colors"
        >
          Data Protection
        </Link>
        <Link 
          href="/accessibility-statement" 
          className="text-[#0a72bd] text-sm hover:text-blue-600 transition-colors"
        >
          Accessibility Statement
        </Link>
        <Link 
          href="/privacy-settings" 
          className="text-[#0a72bd] text-sm hover:text-blue-600 transition-colors"
        >
          Privacy Settings
        </Link>
      </nav>
    </div>
  </footer>
);

export default PageFooter;
