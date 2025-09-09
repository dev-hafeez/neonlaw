"use client";

import Image from "next/image";
import { Mail, Linkedin, Instagram, X } from "lucide-react";
// import Navbar from "@/components/nav/Navbar";
import HeroTransition from "@/components/layout/HeroTransition";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
// import ExitTransition from "@/components/layout/HeroSectionExit";

export default function ContactPage() {
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row h-auto md:h-screen w-full overflow-hidden">
      {/* X Close Button */}
      <button
        onClick={() => router.back()}
        className="absolute bg-[#0a72bd] top-4 right-4 z-50 p-2 rounded hover:bg-gray-100 transition "
        aria-label="Close and go back"
        type="button"
      >
        <X size={28} />
      </button>
      {/* Left side - Image */}
      <HeroTransition />
      <Footer />
      <div className="relative w-full md:w-1/2 h-64 md:h-full">
        <Image
          src="/image.jpg" // Replace with your image path
          alt="Contact Image"
          fill
          className="object-cover"
          style={{
            objectPosition: "left",
            filter: "blur(3px)",
            opacity: 1,
            transition: "filter 0.3s ease-in-out",
            transform: "scale(1.05)",
          }}
          priority
        />
      </div>

      {/* Right side - Contact info */}
      <div className="w-full md:w-1/2 p-6 sm:p-10 lg:p-16 flex flex-col justify-center relative bg-white">
        {/* Vertical separator line for desktop only */}
        <div className="hidden md:block absolute left-0 top-0 h-full border-l border-gray-300" />

        {/* Breadcrumb */}
        <p className="text-xs sm:text-sm font-semibold mb-4 sm:mb-6">
          <a href="/">Home</a> &gt;{" "}
          <span className="text-blue-400">
            <a href="/contact">Contact</a>
          </span>
        </p>

        {/* Logo styled */}
        <div className="flex items-start gap-8">
          {/* Logo */}
          <div className="mb-8 sm:mb-12 select-none">
            <img src="/neon-logo.png" alt="NEON Logo" className="h-48 w-auto" />
          </div>

          {/* Contact Info */}
          <div className="text-gray-900 space-y-6 sm:space-y-8 max-w-sm">
            {/* Address */}
            <div>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.google.de/maps/dir//Schl%C3%BCterstra%C3%9Fe+37,+10629+Berlin/"
                className="block font-bold underline decoration-blue-400 underline-offset-2"
              >
                Schlüterstrasse 37
              </a>
              <a
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.google.de/maps/dir//Schl%C3%BCterstra%C3%9Fe+37,+10629+Berlin/"
                className="block underline decoration-blue-400 underline-offset-2"
              >
                10629 Berlin
              </a>
            </div>

            {/* Phone Numbers */}
            <div className="flex flex-col gap-1">
              <a
                href="tel:+4930889190"
                className="font-bold underline decoration-blue-400 underline-offset-2"
              >
                T +49 30 8 89 19-0
              </a>
              <a
                href="tel:+493088919100"
                className="underline decoration-blue-400 underline-offset-2"
              >
                F +49 30 8 89 19-100
              </a>
            </div>
            <div className="flex space-x-4 sm:space-x-6 mt-4 sm:mt-6">
              {/* Email */}
              <a
                href="mailto:info@neon.law"
                className="p-2 sm:p-3 border rounded-[12px] border-[#0a72bd] text-[#0a72bd] hover:bg-[#0a72bd] hover:text-white transition"
                aria-label="Email"
              >
                <Mail size={28} className="sm:size-7" />
              </a>
              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/company/neonlaw"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-3 border rounded-[12px] border-[#0a72bd] text-[#0a72bd] hover:bg-[#0a72bd] hover:text-white transition"
                aria-label="LinkedIn"
              >
                <Linkedin size={28} className="sm:size-7" />
              </a>
              {/* Instagram */}
              <a
                href="https://www.instagram.com/neon_law_/"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 sm:p-3 border rounded-[12px] border-[#0a72bd] text-[#0a72bd] hover:bg-[#0a72bd] hover:text-white transition"
                aria-label="Instagram"
              >
                <Instagram size={28} className="sm:size-7" />
              </a>
            </div>

            {/* Social Icons */}
          </div>
        </div>

        {/* Contact details */}
        <div className="text-gray-900 space-y-6 sm:space-y-8 max-w-sm">
          {/* Additional info */}
          <div>
            <h3 className="text-blue-400 font-bold mb-1 sm:mb-2">
              Underground parking
            </h3>
            <p className="text-sm sm:text-base">
              You are welcome to use our underground parking facilities. The
              entrance is to the right of our front door at Schlüterstrasse 37.
              Client parking spaces are marked.
            </p>
          </div>

          <div>
            <h3 className="text-blue-400 font-bold mb-1 sm:mb-2">
              Public transport
            </h3>
            <p className="text-sm sm:text-base">You can reach us by</p>
            <ul className="list-disc list-inside mt-1 space-y-1 text-sm sm:text-base">
              <li>S-Bahn (S 5, S 7 and S 75 – Savignyplatz Station)</li>
              <li>
                Bus (lines M19, M29, 109, 149 – Bleibtreustraße and Olivaer Platz
                stops)
              </li>
            </ul>
          </div>
        </div>
      </div>
      
    </div>
  );
}
