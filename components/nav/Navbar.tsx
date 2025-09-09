"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import NavDropdown from "./NavDropdown";
import PeopleDropdown from "./PeopleDropdown";
import MobileMenu from "./MobileMenu";
import SearchSheet from "@/components/nav/SearchSheet";
import { useSearch } from "@/components/context/SearchContext";
import type { NavLink } from "./types";

export default function Navbar() {
  const { setShowApplyNowOnly, showApplyNowOnly, isSearchOpen, setIsSearchOpen } = useSearch();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleOpenChange = (title: string, isOpen: boolean) =>
    setOpenDropdown(isOpen ? title : openDropdown === title ? null : openDropdown);

  const navDropdowns: { title: string; links: NavLink[] }[] = [
    {
      title: "Expertise",
      links: [
        { title: "Corporate", href: "/Expertise?category=Corporate" },
        { title: "Disputes", href: "/Expertise?category=Disputes" },
        { title: "Finance", href: "/Expertise?category=Finance" },
        { title: "M&A", href: "/Expertise?category=M&A" },
        { title: "Notarial Service", href: "/Expertise?category=Notarial Service" },
        { title: "Private Equity", href: "/Expertise?category=Private Equity" },
        { title: "Real Estate", href: "/Expertise?category=Real Estate" },
        { title: "Tax", href: "/Expertise?category=Tax" },
        { title: "Tech & Data", href: "/Expertise?category=Tech & Data" },
        { title: "Venture Capital", href: "/Expertise?category=Venture Capital" },
        { title: "Show All", href: "/Expertise?category=Expertise", showAll: true },
      ],
    },
    {
      title: "News",
      links: [
        { title: "Deals", href: "/News?category=Deals" },
        { title: "Rankings", href: "/News?category=Rankings" },
        { title: "NEON News", href: "/News?category=NEON News" },
        { title: "Legal Insights", href: "/News?category=Legal Insights" },
        { title: "Show All", href: "/News?category=News", showAll: true },
      ],
    },
    {
      title: "Career",
      links: [
        { title: "Jobs", href: "/Career?category=Jobs" },
        { title: "Culture", href: "/Career?category=Culture" },
        { title: "Insights", href: "/Career?category=Insights" },
        { title: "Career Development", href: "/Career?category=Development" },
        { title: "Compensation & Benefits", href: "/Career?category=Compensation" },
        { title: "About us", href: "/Career?category=About" },
        { title: "Show all", href: "/Career?category=Career", showAll: true },
      ],
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Mobile Navbar */}
      <div className="flex lg:hidden bg-white w-full px-4 py-3 shadow-lg border-b justify-between items-center">
        <Link href="/">
          <img src="/neon-logo.png" alt="NEON Logo" className="h-9 w-auto" />
        </Link>

        <div className="flex gap-2 items-center">
          {/* Mobile Search trigger (manual, not SheetTrigger) */}
          <Button
            className="bg-white text-[#0a72bd] rounded-xl w-[120px] px-4 py-2 shadow-md border border-gray-200 hover:scale-105 transition-transform h-14 hover:bg-[#f0f0f0]"
            aria-label="Open search"
            onClick={() => setIsSearchOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" /> Search
          </Button>

          {/* Mobile Menu */}
          <MobileMenu isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} />
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="hidden lg:flex px-4 py-3 justify-between items-center mt-4">
        {/* Desktop Search trigger (manual, not SheetTrigger) */}
        <Button
          className="bg-white text-[#0a72bd] rounded-xl w-[120px] px-4 py-2 shadow-md border border-gray-200 hover:scale-105 transition-transform h-14 hover:bg-[#f0f0f0]"
          aria-label="Open search"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" /> Search
        </Button>

        {/* Center group */}
        <div className="bg-white rounded-lg shadow-lg px-6 py-3 flex items-center space-x-15 border border-gray-100">
          <Link href="/about" className="text-gray-800 hover:text-[#0a72bd] transition-colors font-medium">
            About
          </Link>

          <PeopleDropdown
            isOpen={openDropdown === "People"}
            onOpenChange={(isOpen) => handleOpenChange("People", isOpen)}
          />

          {navDropdowns.slice(0, 1).map((dropdown) => (
            <NavDropdown
              key={dropdown.title}
              {...dropdown}
              isOpen={openDropdown === dropdown.title}
              onOpenChange={(isOpen) => handleOpenChange(dropdown.title, isOpen)}
            />
          ))}

          <Link href="/" className="hover:scale-105 transition-transform">
            <img src="/neon-logo.png" alt="NEON Logo" className="h-10 w-auto" />
          </Link>

          {navDropdowns.slice(1).map((dropdown) => (
            <NavDropdown
              key={dropdown.title}
              {...dropdown}
              isOpen={openDropdown === dropdown.title}
              onOpenChange={(isOpen) => handleOpenChange(dropdown.title, isOpen)}
            />
          ))}

          <Link href="/contact" className="text-gray-800 hover:text-[#0a72bd] transition-colors font-medium">
            Contact
          </Link>
        </div>
        <Link href="/Career?category=Jobs"
          className={`bg-[#0a72bd] flex flex-col items-center justify-center text-white rounded-xl w-[140px] px-4 py-2 shadow-md border border-gray-200 hover:scale-105 transition-transform h-14 hover:bg-[#084a7a] opacity-100`}
          onClick={() => setShowApplyNowOnly(!showApplyNowOnly)}
        >
          APPLY NOW
        </Link>
      </div>

      {/* Single shared Sheet content rendered once to avoid duplicates */}
      <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <SheetContent side="left" className="w-full sm:w-[420px] p-0">
          <SheetHeader>
            <div className="sr-only">
              <SheetTitle>Search</SheetTitle>
              <SheetDescription>
                Search across people, news, and expertise
              </SheetDescription>
            </div>
          </SheetHeader>

          <SearchSheet onClose={() => setIsSearchOpen(false)} />
        </SheetContent>
      </Sheet>
    </nav>
  );
}
