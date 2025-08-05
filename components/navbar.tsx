"use client"

import type React from "react"

import { ChevronDown, Search, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Input } from "@/components/ui/input"

export default function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["About"]) // Default selected
  const [searchQuery, setSearchQuery] = useState("")

  const filters = [
    "News",
    "Career",
    "Culture",
    "Insights",
    "Compensation & Benefits",
    "Career Development",
    "Jobs",
    "Expertise",
    "About",
    "People",
  ]

  const quickLinks = [
    "Talent Boosters",
    "All-In Mindsets",
    "Shortcut Solutions",
    "Unconventional Thinking",
    "Passionate People",
  ]

  const handleFilterClick = (filter: string) => {
    setSelectedFilters((prev) => {
      if (prev.includes(filter)) {
        // Remove filter if already selected
        return prev.filter((f) => f !== filter)
      } else {
        // Add filter if not selected
        return [...prev, filter]
      }
    })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery, "in filters:", selectedFilters)
    // Add your search logic here
  }

  const handleQuickLinkClick = (link: string) => {
    console.log("Quick link clicked:", link)
    // Add navigation logic here
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex w-full justify-between items-center px-4 py-3">
      {/* Left - Search Button */}
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <Button className="bg-white text-[#0a72bd] rounded-full px-4 py-2 shadow-md hover:bg-white hover:scale-105 cursor-pointer border border-gray-200 transition-transform duration-200">
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-full sm:w-96 p-0">
          {/* Custom Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-[#0a72bd]" />
              <span className="text-lg font-medium text-gray-900">Search</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSheetOpen(false)}
              className="h-8 w-8 p-0 hover:bg-gray-100 hover:scale-110 transition-transform duration-200"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="p-6 space-y-6">
            {/* Search Input */}
            <form onSubmit={handleSearch}>
              <Input
                placeholder="What are you looking for?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border-[#0a72bd] focus:border-[#0a72bd] focus:ring-[#0a72bd] hover:scale-105 transition-transform duration-200"
              />
            </form>

            {/* Search Filters */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3">Search in</h4>
              <div className="flex flex-wrap gap-2">
                {filters.map((filter) => (
                  <Button
                    key={filter}
                    variant="outline"
                    size="sm"
                    onClick={() => handleFilterClick(filter)}
                    className={`text-xs px-3 py-1 rounded-full border cursor-pointer transition-transform duration-200 hover:scale-105 ${
                      selectedFilters.includes(filter)
                        ? "bg-[#0a72bd] text-white border-[#0a72bd]"
                        : "border-gray-300 text-gray-700"
                    }`}
                  >
                    {filter}
                    <span className="ml-1 text-xs">+</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Selected Filters Display */}
            {selectedFilters.length > 0 && (
              <div>
                <h5 className="text-xs font-medium text-gray-600 mb-2">Selected filters ({selectedFilters.length}):</h5>
                <div className="flex flex-wrap gap-1">
                  {selectedFilters.map((filter) => (
                    <span
                      key={filter}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-[#0a72bd]/10 text-[#0a72bd] text-xs rounded-full"
                    >
                      {filter}
                      <button
                        onClick={() => handleFilterClick(filter)}
                        className="hover:scale-110 rounded-full p-0.5 transition-transform duration-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Links */}
            <div>
              <div className="space-y-3">
                {quickLinks.map((link) => (
                  <div key={link} className="flex items-center justify-between">
                    <button
                      onClick={() => handleQuickLinkClick(link)}
                      className="text-[#0a72bd] font-medium text-sm cursor-pointer text-left hover:scale-105 transition-transform duration-200"
                    >
                      {link}
                    </button>
                    <span className="text-gray-500 text-sm">Passion</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6 mt-8">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-medium text-gray-800 mb-1">General Inquiries</h5>
                  <a
                    href="mailto:info@neon.law"
                    className="text-sm text-[#0a72bd] hover:scale-105 inline-block transition-transform duration-200"
                  >
                    info@neon.law
                  </a>
                  <br />
                  <a
                    href="tel:+4930123456789"
                    className="text-sm text-[#0a72bd] hover:scale-105 inline-block transition-transform duration-200"
                  >
                    +49 (0) 30 123 456 789
                  </a>
                </div>

                <div>
                  <h5 className="font-medium text-gray-800 mb-1">Business Development</h5>
                  <a
                    href="mailto:business@neon.law"
                    className="text-sm text-[#0a72bd] hover:scale-105 inline-block transition-transform duration-200"
                  >
                    business@neon.law
                  </a>
                  <br />
                  <a
                    href="tel:+4930123456790"
                    className="text-sm text-[#0a72bd] hover:scale-105 inline-block transition-transform duration-200"
                  >
                    +49 (0) 30 123 456 790
                  </a>
                </div>

                <div>
                  <h5 className="font-medium text-gray-800 mb-1">Career Opportunities</h5>
                  <a
                    href="mailto:careers@neon.law"
                    className="text-sm text-[#0a72bd] hover:scale-105 inline-block transition-transform duration-200"
                  >
                    careers@neon.law
                  </a>
                  <br />
                  <a
                    href="tel:+4930123456791"
                    className="text-sm text-[#0a72bd] hover:scale-105 inline-block transition-transform duration-200"
                  >
                    +49 (0) 30 123 456 791
                  </a>
                </div>

                <div>
                  <h5 className="font-medium text-gray-800 mb-1">Office Address</h5>
                  <p className="text-sm text-gray-600">
                    NEON Law Firm
                    <br />
                    Unter den Linden 1<br />
                    10117 Berlin, Germany
                  </p>
                </div>

                <div>
                  <h5 className="font-medium text-gray-800 mb-1">Office Hours</h5>
                  <p className="text-sm text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-sm text-gray-600">Saturday: 10:00 AM - 2:00 PM</p>
                  <p className="text-sm text-gray-600">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Center Navbar */}
      <div className="bg-white rounded-lg shadow-lg px-6 py-2 flex items-center space-x-6 border border-gray-100">
        <Link
          href="/about"
          className="text-[#0a72bd] font-medium hover:underline cursor-pointer hover:scale-105 transition-transform duration-200"
        >
          About
        </Link>

        {["People", "Expertise"].map((item) => (
          <DropdownMenu key={item}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-gray-800 hover:text-[#0a72bd] p-0 h-auto font-medium cursor-pointer hover:scale-105 transition-all duration-200"
              >
                {item} <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <Link href={`/${item.toLowerCase()}/one`} className="w-full">
                  Option 1
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <Link href={`/${item.toLowerCase()}/two`} className="w-full">
                  Option 2
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <Link href={`/${item.toLowerCase()}/three`} className="w-full">
                  Option 3
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ))}

        {/* Center Logo */}
        <Link href="/" className="cursor-pointer hover:scale-105 transition-transform duration-200">
          <img src="/neon-logo.png" alt="NEON Logo" className="h-10 w-auto" />
        </Link>

        {["News", "Career"].map((item) => (
          <DropdownMenu key={item}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="text-gray-800 hover:text-[#0a72bd] p-0 h-auto font-medium cursor-pointer hover:scale-105 transition-all duration-200"
              >
                {item} <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <Link href={`/${item.toLowerCase()}/one`} className="w-full">
                  Option 1
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <Link href={`/${item.toLowerCase()}/two`} className="w-full">
                  Option 2
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:scale-105 transition-transform duration-200">
                <Link href={`/${item.toLowerCase()}/three`} className="w-full">
                  Option 3
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ))}

        <Link
          href="/contact"
          className="text-gray-800 hover:text-[#0a72bd] font-medium cursor-pointer hover:scale-105 transition-all duration-200"
        >
          Contact
        </Link>
      </div>

      {/* Right - Apply Now Button */}
      <Button className="bg-[#0a72bd] text-white font-semibold px-5 py-2 rounded-full hover:bg-[#0a72bd] hover:scale-105 cursor-pointer transition-transform duration-200">
        APPLY NOW
      </Button>
    </nav>
  )
}
