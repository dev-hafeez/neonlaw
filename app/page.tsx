import Navbar from "@/components/navbar"
import PinterestMasonry from "@/components/pinterest-masonry"
import HeroTransition from "@/components/HeroTransition"

export default function Page() {
  return (
<div className="bg-[#f9f9f9] relative">
       <HeroTransition />
      {/* Background NEON Logo */}
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 ">
        <img src="/Blue.png" alt="NEON Background Logo" className="w-96 h-96 object-contain" />
      </div>

      {/* Cards start from top - behind navbar */}
      <div className="relative z-10 pt-4 pb-12">
        <PinterestMasonry />
      </div>
      {/* Navbar on top */}
      <Navbar />
    </div>
  )
 }
