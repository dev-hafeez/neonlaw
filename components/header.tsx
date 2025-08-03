"use client"

import { Search, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Header() {
  const handleSearchClick = () => {
    const overlay = document.getElementById("search-overlay")
    if (overlay) {
      overlay.classList.remove("hidden")
      overlay.classList.add("flex")
      setTimeout(() => {
        const searchInput = document.getElementById("search-input")
        if (searchInput) {
          searchInput.focus()
        }
      }, 100)
    }
  }

  return (
    <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-6xl">
      {/* Search Button - Left */}
      <div className="absolute left-0 top-0 h-16 flex items-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSearchClick}
          className="text-[#e6007a] hover:text-[#0a72bd] hover:bg-white/50 rounded-full px-4 py-2 font-medium shadow-lg bg-white border-2"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>

      {/* Center Navigation */}
      <div className="flex items-center justify-center h-16 bg-white rounded-xl shadow-lg border-2 px-8 mx-auto w-fit">
        <nav className="hidden lg:flex items-center space-x-8">
          <Link href="/about" className="text-gray-700 hover:text-[#e6007a] font-medium">
            About
          </Link>
          <div className="relative group">
            <button className="flex items-center text-gray-700 hover:text-[#e6007a] font-medium">
              People
              <ChevronDown className="h-4 w-4 ml-1 text-[#e6007a]" />
            </button>
          </div>
          <div className="relative group">
            <button className="flex items-center text-gray-700 hover:text-[#e6007a] font-medium">
              Expertise
              <ChevronDown className="h-4 w-4 ml-1 text-[#e6007a]" />
            </button>
          </div>

          {/* NEON Logo in center */}
          <Link href="/" className="flex items-center mx-8">
            <span className="text-2xl font-bold text-gray-900">N</span>
            <span className="text-2xl font-bold text-[#e6007a]">E</span>
            <span className="text-2xl font-bold text-gray-900">ON</span>
          </Link>

          <div className="relative group">
            <button className="flex items-center text-gray-700 hover:text-[#e6007a] font-medium">
              News
              <ChevronDown className="h-4 w-4 ml-1 text-[#e6007a]" />
            </button>
          </div>
          <div className="relative group">
            <button className="flex items-center text-gray-700 hover:text-[#e6007a] font-medium">
              Career
              <ChevronDown className="h-4 w-4 ml-1 text-[#e6007a]" />
            </button>
          </div>
          <Link href="/contact" className="text-gray-700 hover:text-[#e6007a] font-medium">
            Contact
          </Link>
        </nav>
      </div>

      {/* Apply Now Button - Right */}
      <div className="absolute right-0 top-0 h-16 flex items-center">
        <Button className="bg-[#e6007a] hover:bg-[#e6007a]/90 text-white font-bold px-6 py-2 rounded-full shadow-lg border-2">
          APPLY NOW
        </Button>
      </div>
    </header>
  )
}
