"use client";

export default function ScrollToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <button 
      onClick={scrollToTop}
      className="text-[#0a72bd] hover:text-blue-600 transition-colors duration-200 font-medium text-sm"
      aria-label="Scroll to top"
    >
      to the top ^
    </button>
  );
}
