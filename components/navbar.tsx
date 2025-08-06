"use client"

import type React from "react"
import { ChevronDown, Search } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Input } from "@/components/ui/input"

export default function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["About"])
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
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter],
    )
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery, "in filters:", selectedFilters)
  }

  const handleQuickLinkClick = (link: string) => {
    console.log("Quick link clicked:", link)
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

        {/* NOTE: SheetContent already includes a close (X) button by default. */}
        <SheetContent side="left" className="w-full sm:w-96 p-0">
          <SheetTitle>
            <VisuallyHidden>Search</VisuallyHidden>
          </SheetTitle>

          {/* Header (no extra X here) */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-3">
              <Search className="h-5 w-5 text-[#0a72bd]" />
              <span className="text-lg font-medium text-gray-900">Search</span>
            </div>
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
                <h5 className="text-xs font-medium text-gray-600 mb-2">
                  Selected filters ({selectedFilters.length}):
                </h5>
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
                        aria-label={`Remove ${filter}`}
                      >
                        {/* the default close in SheetContent stays; this is just the tag remove X */}
                        ×
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

            {/* Contact Information — REMOVED */}
            {/* If you ever want to toggle it, wrap it in: {showContacts && ( ... )} */}
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
