"use client";
import { motion, AnimatePresence } from "framer-motion";
import type React from "react";
import {
  ChevronDown, Search, Menu, Info, Users, Brain, Newspaper, Briefcase, Mail, Rocket
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Input } from "@/components/ui/input";

const menuVariants = { initial: { opacity: 0, y: 10 }, animate: { opacity: 1, y: 0, transition: { duration: 0.2 } }, exit: { opacity: 0, y: 10, transition: { duration: 0.2 } } };
const itemVariants = { initial: { opacity: 0, y: -5 }, animate: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }) };

interface NavLink { title: string; href: string; showAll?: boolean; }
interface DropdownProps { title: string; links: NavLink[]; isOpen: boolean; onOpenChange: (isOpen: boolean) => void; }

const NavDropdown: React.FC<DropdownProps> = ({ title, links, isOpen, onOpenChange }) => (
  <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
    <DropdownMenuTrigger className="flex items-center gap-1 text-gray-800 hover:text-[#0a72bd] transition-colors font-medium cursor-pointer">
      {title} <ChevronDown className="h-4 w-4" />
    </DropdownMenuTrigger>
    <AnimatePresence>
      {isOpen && (
        <DropdownMenuContent align="start" className="w-64 p-0 border-none rounded-b-lg shadow-2xl overflow-hidden mt-0 rounded-t-none" asChild forceMount>
          <motion.div variants={menuVariants} initial="initial" animate="animate" exit="exit" className="p-4 bg-white space-y-2">
            {links.map((link, index) => (
              <motion.div key={link.title} variants={itemVariants} custom={index}>
                <DropdownMenuItem className="p-0 focus:bg-transparent">
                  <Link 
                    href={link.href} 
                    className={`block w-full py-2 px-3 text-gray-700 rounded-md transition-colors ${link.showAll ? "font-bold text-[#0a72bd] mt-2 border-t pt-3" : "hover:bg-gray-100"}`}
                    onClick={() => onOpenChange(false)}
                  >
                    {link.title}
                  </Link>
                </DropdownMenuItem>
              </motion.div>
            ))}
          </motion.div>
        </DropdownMenuContent>
      )}
    </AnimatePresence>
  </DropdownMenu>
);

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["About"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleOpenChange = (title: string, isOpen: boolean) => setOpenDropdown(isOpen ? title : openDropdown === title ? null : openDropdown);
  const filters = ["News", "Career", "Culture", "Insights", "Compensation & Benefits", "Career Development", "Jobs", "Expertise", "About", "People"];
  const quickLinks = ["Talent Boosters", "All-In Mindsets", "Shortcut Solutions", "Unconventional Thinking", "Passionate People"];

  const navDropdowns = [
    { title: "People", links: [{ title: "Corporate", href: "/people?cat=corporate" }, { title: "Disputes", href: "/people?cat=disputes" }, { title: "Finance", href: "/people?cat=finance" }, { title: "M&A", href: "/people?cat=manda" }, { title: "Notarial Service", href: "/people?cat=notarial" }, { title: "Private Equity", href: "/people?cat=equity" }, { title: "Real Estate", href: "/people?cat=real-estate" }, { title: "Tax", href: "/people?cat=tax" }, { title: "Tech & Data", href: "/people?cat=technology-data" }, { title: "Venture Capital", href: "/people?cat=venturecapital" }, { title: "People & Culture", href: "/people?cat=peopleandculture" }, { title: "Operations", href: "/people?cat=operations" }, { title: "Marketing", href: "/people?cat=marketing" }, { title: "Show All", href: "/people", showAll: true }] },
    { title: "Expertise", links: [{ title: "Corporate", href: "/people/one" }, { title: "Disputes", href: "/people/two" }, { title: "Finance", href: "/people/three" }, { title: "M&A", href: "/people/one" }, { title: "Notarial Service", href: "/people/two" }, { title: "Private Equity", href: "/people/three" }, { title: "Real Estate", href: "/people/one" }, { title: "Tax", href: "/people/two" }, { title: "Tech & Data", href: "/people/three" }, { title: "Venture Capital", href: "/people/one" }, { title: "Show All", href: "/people", showAll: true }] },
    { title: "News", links: [{ title: "Deals", href: "/news/press" }, { title: "Rankings", href: "/news/articles" }, { title: "NEON News", href: "/news/case-studies" }, { title: "Legal Insights", href: "/news", showAll: true }, { title: "Show All", href: "/news", showAll: true }] },
    { title: "Career", links: [{ title: "Jobs", href: "/career/jobs" }, { title: "Culture", href: "/career/culture" }, { title: "Insights", href: "/career/insights" }, { title: "Career Development", href: "/career/development" }, { title: "Compensation & Benefits", href: "/career/compensation" }, { title: "About us", href: "/about" }, { title: "Show all", href: "/career", showAll: true }] }
  ];

  const handleFilterClick = (filter: string) => setSelectedFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);
  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); console.log("Searching for:", searchQuery, "in filters:", selectedFilters); };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Mobile Navbar */}
      <div className="flex lg:hidden bg-white w-full px-4 py-3 shadow-lg border-b justify-between items-center">
        <Link href="/"><img src="/neon-logo.png" alt="NEON Logo" className="h-9 w-auto" /></Link>
        <div className="flex gap-2 items-center">
          <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#0a72bd]"><Search className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full sm:w-96 p-0">
              <SheetTitle><VisuallyHidden>Search</VisuallyHidden></SheetTitle>
              <div className="flex items-center gap-3 p-6 border-b"><Search className="h-5 w-5 text-[#0a72bd]" /><span className="text-lg font-medium text-gray-900">Search</span></div>
              <div className="p-6 space-y-6">
                <form onSubmit={handleSearch}><Input placeholder="What are you looking for?" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full border-[#0a72bd] focus:border-[#0a72bd] focus:ring-[#0a72bd] hover:scale-105 transition-transform" /></form>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Search in</h4>
                  <div className="flex flex-wrap gap-2">
                    {filters.map(filter => (
                      <Button key={filter} variant="outline" size="sm" onClick={() => handleFilterClick(filter)} className={`text-xs px-3 py-1 rounded-full border cursor-pointer hover:scale-105 transition-transform ${selectedFilters.includes(filter) ? "bg-[#0a72bd] text-white border-[#0a72bd]" : "border-gray-300 text-gray-700"}`}>{filter} <span className="ml-1 text-xs">+</span></Button>
                    ))}
                  </div>
                </div>
                {selectedFilters.length > 0 && (
                  <div>
                    <h5 className="text-xs font-medium text-gray-600 mb-2">Selected filters ({selectedFilters.length}):</h5>
                    <div className="flex flex-wrap gap-1">
                      {selectedFilters.map(filter => (
                        <span key={filter} className="inline-flex items-center gap-1 px-2 py-1 bg-[#0a72bd]/10 text-[#0a72bd] text-xs rounded-full">
                          {filter}
                          <button onClick={() => handleFilterClick(filter)} className="hover:scale-110 rounded-full p-0.5 transition-transform">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <div className="space-y-3">
                  {quickLinks.map(link => (
                    <div key={link} className="flex items-center justify-between">
                      <button className="text-[#0a72bd] font-medium text-sm hover:scale-105 transition-transform">{link}</button>
                      <span className="text-gray-500 text-sm">Passion</span>
                    </div>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#0a72bd]"><Menu className="h-6 w-6" /></Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 p-6 space-y-4">
              <SheetTitle>Menu</SheetTitle>
              <ul className="space-y-3">
                <li><Link href="/about" className="flex items-center gap-2 text-[#0a72bd]"><Info size={18} /> About</Link></li>
                <li><Link href="/people" className="flex items-center gap-2 text-[#0a72bd]"><Users size={18} /> People</Link></li>
                <li><Link href="/expertise" className="flex items-center gap-2 text-[#0a72bd]"><Brain size={18} /> Expertise</Link></li>
                <li><Link href="/news" className="flex items-center gap-2 text-[#0a72bd]"><Newspaper size={18} /> News</Link></li>
                <li><Link href="/career" className="flex items-center gap-2 text-[#0a72bd]"><Briefcase size={18} /> Career</Link></li>
                <li><Link href="/contact" className="flex items-center gap-2 text-[#0a72bd]"><Mail size={18} /> Contact</Link></li>
                <li><Button className="w-full bg-[#0a72bd] text-white flex items-center justify-center gap-2"><Rocket size={18} /> APPLY NOW</Button></li>
              </ul>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* Desktop Navbar */}
      <div className="hidden lg:flex px-4 py-3 justify-between items-center mt-4">
        <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <SheetTrigger asChild>
            <Button className="bg-white text-[#0a72bd] rounded-xl w-[120px] px-4 py-2 shadow-md border border-gray-200 hover:scale-105 transition-transform h-14 hover:bg-[#f0f0f0]"><Search className="mr-2 h-14 w-4" /> Search</Button>
          </SheetTrigger>
        </Sheet>
        <div className="bg-white rounded-lg shadow-lg px-6 py-3 flex items-center space-x-15 border border-gray-100">
          <Link href="/about" className="text-gray-800 hover:text-[#0a72bd] transition-colors font-medium">About</Link>
          {navDropdowns.slice(0, 2).map(dropdown => (
            <NavDropdown key={dropdown.title} {...dropdown} isOpen={openDropdown === dropdown.title} onOpenChange={(isOpen) => handleOpenChange(dropdown.title, isOpen)} />
          ))}
          <Link href="/" className="hover:scale-105 transition-transform"><img src="/neon-logo.png" alt="NEON Logo" className="h-10 w-auto" /></Link>
          {navDropdowns.slice(2).map(dropdown => (
            <NavDropdown key={dropdown.title} {...dropdown} isOpen={openDropdown === dropdown.title} onOpenChange={(isOpen) => handleOpenChange(dropdown.title, isOpen)} />
          ))}
          <Link href="/contact" className="text-gray-800 hover:text-[#0a72bd] transition-colors font-medium">Contact</Link>
        </div>
        <Button className="bg-[#0a72bd] text-white font-semibold px-5 py-2 rounded-xl hover:scale-105 h-14 hover:bg-[#085a96]">APPLY NOW</Button>
      </div>
    </nav>
  );
}
