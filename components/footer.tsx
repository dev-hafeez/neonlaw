import React from 'react';
import Link from 'next/link';

const Footer: React.FC = () => (
  <footer
    style={{
      background: '#fff',
      color: '#0a72bd',
      padding: '0.5rem 0',
      position: 'fixed',
      left: 0,
      bottom: 0,
      width: '100%',
      zIndex: 1000,
      boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
    }}
  >
    <div className="max-w-[1200px]   xl:ml-135 w-full flex justify-end items-end">

    
      <nav style={{ display: 'flex', gap: '1.2rem' }}>
        <Link href="/contact" style={{ color: '#0a72bd', fontSize: '0.95rem', textDecoration: 'none' }}>Contact</Link>
        <Link href="/Imprint" style={{ color: '#0a72bd', fontSize: '0.95rem', textDecoration: 'none' }}>Imprint</Link>
        <Link href="/DataProtection" style={{ color: '#0a72bd', fontSize: '0.95rem', textDecoration: 'none' }}>Data Protection</Link>
        <Link href="/PrivacySettings" style={{ color: '#0a72bd', fontSize: '0.95rem', textDecoration: 'none' }}>Privacy Settings</Link>
      </nav>
    </div>
  </footer>
);

export default Footer;