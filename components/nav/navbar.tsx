"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

import NavDropdown from "./NavDropdown";
import PeopleDropdown from "./PeopleDropdown";
import SearchSheet from "./SearchSheet";
import MobileMenu from "./MobileMenu";
import type { NavLink } from "./types";

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState<string[]>(["About"]);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleOpenChange = (title: string, isOpen: boolean) => setOpenDropdown(isOpen ? title : openDropdown === title ? null : openDropdown);

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
  ];

  const navDropdowns: { title: string; links: NavLink[] }[] = [
    {
      title: "Expertise",
      links: [
        { title: "Corporate", href: "/people/one" },
        { title: "Disputes", href: "/people/two" },
        { title: "Finance", href: "/people/three" },
        { title: "M&A", href: "/people/one" },
        { title: "Notarial Service", href: "/people/two" },
        { title: "Private Equity", href: "/people/three" },
        { title: "Real Estate", href: "/people/one" },
        { title: "Tax", href: "/people/two" },
        { title: "Tech & Data", href: "/people/three" },
        { title: "Venture Capital", href: "/people/one" },
        { title: "Show All", href: "/people", showAll: true },
      ],
    },
    {
      title: "News",
      links: [
        { title: "Deals", href: "/news/press" },
        { title: "Rankings", href: "/news/articles" },
        { title: "NEON News", href: "/news/case-studies" },
        { title: "Legal Insights", href: "/news", showAll: true },
        { title: "Show All", href: "/news", showAll: true },
      ],
    },
    {
      title: "Career",
      links: [
        { title: "Jobs", href: "/career/jobs" },
        { title: "Culture", href: "/career/culture" },
        { title: "Insights", href: "/career/insights" },
        { title: "Career Development", href: "/career/development" },
        { title: "Compensation & Benefits", href: "/career/compensation" },
        { title: "About us", href: "/about" },
        { title: "Show all", href: "/career", showAll: true },
      ],
    },
  ];

  const onToggleFilter = (filter: string) =>
    setSelectedFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]));

  const onSearch = (query: string, filters: string[]) => {
    // TODO: wire your search route
    console.log("Searching for:", query, "in filters:", filters);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      {/* Mobile Navbar */}
      <div className="flex lg:hidden bg-white w-full px-4 py-3 shadow-lg border-b justify-between items-center">
        <Link href="/">
          <img src="/neon-logo.png" alt="NEON Logo" className="h-9 w-auto" />
        </Link>
        <div className="flex gap-2 items-center">
          {/* Mobile Search (reuse SearchSheet trigger) */}
          <SearchSheet
            isOpen={isSearchOpen}
            onOpenChange={setIsSearchOpen}
            filters={filters}
            selectedFilters={selectedFilters}
            onToggleFilter={onToggleFilter}
            onSearch={onSearch}
          />
          {/* Mobile Menu */}
          <MobileMenu isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} />
        </div>
      </div>

      {/* Desktop Navbar */}
      <div className="hidden lg:flex px-4 py-3 justify-between items-center mt-4">
        {/* Search */}
        <SearchSheet
          isOpen={isSearchOpen}
          onOpenChange={setIsSearchOpen}
          filters={filters}
          selectedFilters={selectedFilters}
          onToggleFilter={onToggleFilter}
          onSearch={onSearch}
        />

        {/* Center group */}
        <div className="bg-white rounded-lg shadow-lg px-6 py-3 flex items-center space-x-15 border border-gray-100">
          <Link href="/about" className="text-gray-800 hover:text-[#0a72bd] transition-colors font-medium">
            About
          </Link>

          {/* People (dynamic mega menu) */}
          <PeopleDropdown isOpen={openDropdown === "People"} onOpenChange={(isOpen) => handleOpenChange("People", isOpen)} />

          {/* Other dropdowns */}
          {navDropdowns.slice(0, 1).map((dropdown) => (
            <NavDropdown
              key={dropdown.title}
              {...dropdown}
              isOpen={openDropdown === dropdown.title}
              onOpenChange={(isOpen) => handleOpenChange(dropdown.title, isOpen)}
            />
          ))}

          {/* Center logo */}
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

        <Button className="bg-[#0a72bd] text-white font-semibold px-5 py-2 rounded-xl hover:scale-105 h-14 hover:bg-[#085a96]">
          APPLY NOW
        </Button>
      </div>
    </nav>
  );
}








// "use client";

// import { motion, AnimatePresence } from "framer-motion";
// import type React from "react";
// import {
//   ChevronDown, ChevronRight, Search, Menu, Info, Users, Brain, Newspaper, Briefcase, Mail, Rocket
// } from "lucide-react";
// import Link from "next/link";
// import { useEffect, useRef, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
// import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
// import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
// import { Input } from "@/components/ui/input";
// import PeopleMegaMenu from "@/components/navbar/PeopleMegaMenu";
// import type { PeopleMenuData } from "@/lib/peopleMenu";


// // ---- Types for People menu API ----
// type PeopleMenuItem = { title: string; slug: string };
// type PeopleMenuCategory = { name: string; slug: string; people: PeopleMenuItem[] };
// // type PeopleMenuData = { categories: PeopleMenuCategory[]; error?: string };

// // ---- Anim variants (unchanged) ----
// const menuVariants = {
//   initial: { opacity: 0, y: 10 },
//   animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
//   exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
// };
// const itemVariants = {
//   initial: { opacity: 0, y: -5 },
//   animate: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } })
// };

// interface NavLink { title: string; href: string; showAll?: boolean }
// interface DropdownProps { title: string; links: NavLink[]; isOpen: boolean; onOpenChange: (isOpen: boolean) => void }

// // Generic dropdown (used for non-People menus)
// const NavDropdown: React.FC<DropdownProps> = ({ title, links, isOpen, onOpenChange }) => (
//   <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
//     <DropdownMenuTrigger className="flex items-center gap-1 text-gray-800 hover:text-[#0a72bd] transition-colors font-medium cursor-pointer">
//       {title} <ChevronDown className="h-4 w-4" />
//     </DropdownMenuTrigger>
//     <AnimatePresence>
//       {isOpen && (
//         <DropdownMenuContent
//           align="start"
//           className="w-64 p-0 border-none rounded-b-lg shadow-2xl overflow-hidden mt-0 rounded-t-none"
//           asChild
//           forceMount
//         >
//           <motion.div variants={menuVariants} initial="initial" animate="animate" exit="exit" className="p-4 bg-white space-y-2">
//             {links.map((link, index) => (
//               <motion.div key={link.title} variants={itemVariants} custom={index}>
//                 <DropdownMenuItem className="p-0 focus:bg-transparent">
//                   <Link
//                     href={link.href}
//                     className={`block w-full py-2 px-3 text-gray-700 rounded-md transition-colors ${link.showAll ? "font-bold text-[#0a72bd] mt-2 border-t pt-3" : "hover:bg-gray-100"}`}
//                     onClick={() => onOpenChange(false)}
//                   >
//                     {link.title}
//                   </Link>
//                 </DropdownMenuItem>
//               </motion.div>
//             ))}
//           </motion.div>
//         </DropdownMenuContent>
//       )}
//     </AnimatePresence>
//   </DropdownMenu>
// );

// //people drop down
// const ROW_H = 40; // must match h-10 below

// export function PeopleDropdown({
//   isOpen,
//   onOpenChange,
//   slugsOrder = [
//     "corporate",
//     "disputes",
//     "finance",
//     "ma",
//     "notarial-service",
//     "private-equity",
//     "real-estate",
//     "tax",
//     "tech-data",
//     "venture-capital",
//     "people-culture",
//     "operations",
//     "marketing",
//   ],
//   limit = 16,
// }: {
//   isOpen: boolean;
//   onOpenChange: (isOpen: boolean) => void;
//   slugsOrder?: string[];
//   limit?: number;
// }) {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<PeopleMenuData | null>(null);

//   // fetch once on first open
//   useEffect(() => {
//     if (!isOpen || data || loading) return;
//     setLoading(true);
//     const qs = new URLSearchParams({ limit: String(limit), slugs: slugsOrder.join(",") });
//     fetch(`/api/people-menu?${qs.toString()}`)
//       .then((r) => r.json())
//       .then((json: PeopleMenuData) => setData(json))
//       .catch(() => setData({ categories: [], error: "Failed to load menu" }))
//       .finally(() => setLoading(false));
//   }, [isOpen, data, loading, slugsOrder, limit]);

//   const labelFromSlug = (slug: string) =>
//     slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

//   // normalize to always show all slugs, keep order
//   const map = new Map<string, { name: string; people: PeopleMenuItem[] }>();
//   (data?.categories ?? []).forEach((c) =>
//     map.set(c.slug, { name: c.name || labelFromSlug(c.slug), people: c.people || [] })
//   );
//   const cats = slugsOrder.map((slug) => {
//     const e = map.get(slug);
//     return {
//       slug,
//       name: e?.name || labelFromSlug(slug),
//       people: (e?.people || []).slice(0, limit).sort((a, b) => a.title.localeCompare(b.title)),
//     };
//   });

//   // fly-out state
//   const firstWithPeople = cats.find((c) => c.people.length)?.slug ?? cats[0]?.slug ?? "";
//   const [activeSlug, setActiveSlug] = useState(firstWithPeople);
//   const [flyTop, setFlyTop] = useState(0); // px from top of left list
//   const listRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     if (!activeSlug && cats.length) setActiveSlug(firstWithPeople);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [data]);

//   function openFlyout(slug: string, rowIndex: number) {
//     setActiveSlug(slug);
//     const scrollTop = listRef.current?.scrollTop ?? 0;
//     // place fly-out near the row; clamp a little for aesthetics
//     const top = rowIndex * ROW_H - scrollTop;
//     setFlyTop(Math.max(8, top));
//   }

//   const activeCat = cats.find((c) => c.slug === activeSlug) || cats[0];

//   return (
//     <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
//       <DropdownMenuTrigger className="flex items-center gap-1 text-gray-800 hover:text-[#0a72bd] transition-colors font-medium cursor-pointer">
//         People <ChevronDown className="h-4 w-4" />
//       </DropdownMenuTrigger>

//       <AnimatePresence>
//         {isOpen && (
//           <DropdownMenuContent
//             align="start"
//             sideOffset={10}
//             className="p-0 border-none rounded-xl shadow-2xl overflow-visible mt-0"
//             asChild
//             forceMount
//           >
//             <motion.div
//               initial={{ opacity: 0, y: 8 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: 8 }}
//               transition={{ duration: 0.18 }}
//             >
//               {/* Make this relative so the fly-out positions next to it */}
//               <div className="relative bg-white w-[240px] max-w-[92vw]">
//                 {loading ? (
//                   <div className="p-6 text-sm text-gray-500">Loading…</div>
//                 ) : (
//                   <>
//                     {/* LEFT: categories list */}
//                     <div
//                       ref={listRef}
//                       className="max-h-[48vh] overflow-y-auto rounded-l-xl"
//                     >
//                       <ul className="py-1">
//                         {cats.map((c, idx) => {
//                           const selected = c.slug === activeSlug;
//                           return (
//                             <li key={c.slug} className="group">
//                               <div className="w-full h-10 px-3 flex items-center justify-between">
//                                 {/* Label → category page */}
//                                 <Link
//                                   href={`/people?cat=${encodeURIComponent(c.slug)}`}
//                                   data-no-transition
//                                   onClick={() => onOpenChange(false)}
//                                   className={`truncate text-sm hover:text-black ${
//                                     selected ? "text-rose-600 font-semibold" : "text-gray-900"
//                                   }`}
//                                 >
//                                   {c.name}
//                                 </Link>

//                                 {/* Arrow → open fly-out next to this row */}
//                                 <button
//                                   type="button"
//                                   aria-label="Show people"
//                                   className={`ml-2 p-1 rounded-md transition-colors ${
//                                     selected ? "text-rose-600" : "text-gray-400 group-hover:text-gray-600"
//                                   }`}
//                                   onClick={(e) => {
//                                     e.preventDefault();
//                                     openFlyout(c.slug, idx);
//                                   }}
//                                   onMouseEnter={() => openFlyout(c.slug, idx)}
//                                 >
//                                   <ChevronRight className="h-5 w-5" />
//                                 </button>
//                               </div>
//                             </li>
//                           );
//                         })}
//                       </ul>
//                     </div>

//                     {/* RIGHT FLY-OUT: names panel */}
//                     <div
//                       className="absolute left-[248px] w-[360px] max-w-[60vw] max-h-[48vh] overflow-auto bg-white rounded-xl shadow-xl border"
//                       style={{ top: flyTop }}
//                     >
//                       <div className="flex items-center justify-between px-3 py-2 border-b">
//                         <div className="text-[14px] font-semibold truncate">
//                           {activeCat?.name}
//                         </div>
//                         <Link
//                           href={`/people?cat=${encodeURIComponent(activeCat.slug)}`}
//                           className="text-[11px] text-gray-500 hover:text-gray-700"
//                           data-no-transition
//                           onClick={() => onOpenChange(false)}
//                         >
//                           Show all
//                         </Link>
//                       </div>

//                       {activeCat?.people?.length ? (
//                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 p-3">
//                           {activeCat.people.map((p) => (
//                             <Link
//                               key={p.slug}
//                               href={`/people/${encodeURIComponent(p.slug)}`}
//                               className="text-[13px] text-gray-800 hover:text-black truncate"
//                               onClick={() => onOpenChange(false)}
//                             >
//                               {p.title}
//                             </Link>
//                           ))}
//                         </div>
//                       ) : (
//                         <div className="p-3 text-[12px] text-gray-400">No people yet</div>
//                       )}
//                     </div>
//                   </>
//                 )}
//               </div>
//             </motion.div>
//           </DropdownMenuContent>
//         )}
//       </AnimatePresence>
//     </DropdownMenu>
//   );
// }

// export default function Navbar() {
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [selectedFilters, setSelectedFilters] = useState<string[]>(["About"]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);

//   const handleOpenChange = (title: string, isOpen: boolean) =>
//     setOpenDropdown(isOpen ? title : openDropdown === title ? null : openDropdown);

//   const filters = ["News", "Career", "Culture", "Insights", "Compensation & Benefits", "Career Development", "Jobs", "Expertise", "About", "People"];
//   const quickLinks = ["Talent Boosters", "All-In Mindsets", "Shortcut Solutions", "Unconventional Thinking", "Passionate People"];

//   // keep your original static dropdown data for non-People menus
//   const navDropdowns = [
//     // People is now handled by PeopleDropdown (dynamic)
//     {
//       title: "Expertise",
//       links: [
//         { title: "Corporate", href: "/people/one" },
//         { title: "Disputes", href: "/people/two" },
//         { title: "Finance", href: "/people/three" },
//         { title: "M&A", href: "/people/one" },
//         { title: "Notarial Service", href: "/people/two" },
//         { title: "Private Equity", href: "/people/three" },
//         { title: "Real Estate", href: "/people/one" },
//         { title: "Tax", href: "/people/two" },
//         { title: "Tech & Data", href: "/people/three" },
//         { title: "Venture Capital", href: "/people/one" },
//         { title: "Show All", href: "/people", showAll: true },
//       ],
//     },
//     {
//       title: "News",
//       links: [
//         { title: "Deals", href: "/news/press" },
//         { title: "Rankings", href: "/news/articles" },
//         { title: "NEON News", href: "/news/case-studies" },
//         { title: "Legal Insights", href: "/news", showAll: true },
//         { title: "Show All", href: "/news", showAll: true },
//       ],
//     },
//     {
//       title: "Career",
//       links: [
//         { title: "Jobs", href: "/career/jobs" },
//         { title: "Culture", href: "/career/culture" },
//         { title: "Insights", href: "/career/insights" },
//         { title: "Career Development", href: "/career/development" },
//         { title: "Compensation & Benefits", href: "/career/compensation" },
//         { title: "About us", href: "/about" },
//         { title: "Show all", href: "/career", showAll: true },
//       ],
//     },
//   ];

//   const handleFilterClick = (filter: string) =>
//     setSelectedFilters(prev => prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]);

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault();
//     // TODO: wire your search route
//     console.log("Searching for:", searchQuery, "in filters:", selectedFilters);
//   };

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50">
//       {/* Mobile Navbar */}
//       <div className="flex lg:hidden bg-white w-full px-4 py-3 shadow-lg border-b justify-between items-center">
//         <Link href="/"><img src="/neon-logo.png" alt="NEON Logo" className="h-9 w-auto" /></Link>
//         <div className="flex gap-2 items-center">
//           {/* Mobile Search */}
//           <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
//             <SheetTrigger asChild>
//               <Button variant="ghost" size="icon" className="text-[#0a72bd]"><Search className="h-5 w-5" /></Button>
//             </SheetTrigger>
//             <SheetContent side="left" className="w-full sm:w-96 p-0">
//               <SheetTitle><VisuallyHidden>Search</VisuallyHidden></SheetTitle>
//               <div className="flex items-center gap-3 p-6 border-b">
//                 <Search className="h-5 w-5 text-[#0a72bd]" />
//                 <span className="text-lg font-medium text-gray-900">Search</span>
//               </div>
//               <div className="p-6 space-y-6">
//                 <form onSubmit={handleSearch}>
//                   <Input
//                     placeholder="What are you looking for?"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                     className="w-full border-[#0a72bd] focus:border-[#0a72bd] focus:ring-[#0a72bd] hover:scale-105 transition-transform"
//                   />
//                 </form>

//                 <div>
//                   <h4 className="text-sm font-medium text-gray-900 mb-3">Search in</h4>
//                   <div className="flex flex-wrap gap-2">
//                     {filters.map(filter => (
//                       <Button
//                         key={filter}
//                         variant="outline"
//                         size="sm"
//                         onClick={() => handleFilterClick(filter)}
//                         className={`text-xs px-3 py-1 rounded-full border cursor-pointer hover:scale-105 transition-transform ${
//                           selectedFilters.includes(filter)
//                             ? "bg-[#0a72bd] text-white border-[#0a72bd]"
//                             : "border-gray-300 text-gray-700"
//                         }`}
//                       >
//                         {filter} <span className="ml-1 text-xs">+</span>
//                       </Button>
//                     ))}
//                   </div>
//                 </div>

//                 {selectedFilters.length > 0 && (
//                   <div>
//                     <h5 className="text-xs font-medium text-gray-600 mb-2">Selected filters ({selectedFilters.length}):</h5>
//                     <div className="flex flex-wrap gap-1">
//                       {selectedFilters.map(filter => (
//                         <span
//                           key={filter}
//                           className="inline-flex items-center gap-1 px-2 py-1 bg-[#0a72bd]/10 text-[#0a72bd] text-xs rounded-full"
//                         >
//                           {filter}
//                           <button
//                             onClick={() => handleFilterClick(filter)}
//                             className="hover:scale-110 rounded-full p-0.5 transition-transform"
//                           >
//                             ×
//                           </button>
//                         </span>
//                       ))}
//                     </div>
//                   </div>
//                 )}

//                 <div className="space-y-3">
//                   {["Talent Boosters","All-In Mindsets","Shortcut Solutions","Unconventional Thinking","Passionate People"].map(link => (
//                     <div key={link} className="flex items-center justify-between">
//                       <button className="text-[#0a72bd] font-medium text-sm hover:scale-105 transition-transform">{link}</button>
//                       <span className="text-gray-500 text-sm">Passion</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </SheetContent>
//           </Sheet>

//           {/* Mobile Menu */}
//           <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
//             <SheetTrigger asChild>
//               <Button variant="ghost" size="icon" className="text-[#0a72bd]">
//                 <Menu className="h-6 w-6" />
//               </Button>
//             </SheetTrigger>
//             <SheetContent side="right" className="w-64 p-6 space-y-4">
//               <SheetTitle>Menu</SheetTitle>
//               <ul className="space-y-3">
//                 <li><Link href="/about" className="flex items-center gap-2 text-[#0a72bd]"><Info size={18} /> About</Link></li>
//                 <li><Link href="/people" className="flex items-center gap-2 text-[#0a72bd]"><Users size={18} /> People</Link></li>
//                 <li><Link href="/expertise" className="flex items-center gap-2 text-[#0a72bd]"><Brain size={18} /> Expertise</Link></li>
//                 <li><Link href="/news" className="flex items-center gap-2 text-[#0a72bd]"><Newspaper size={18} /> News</Link></li>
//                 <li><Link href="/career" className="flex items-center gap-2 text-[#0a72bd]"><Briefcase size={18} /> Career</Link></li>
//                 <li><Link href="/contact" className="flex items-center gap-2 text-[#0a72bd]"><Mail size={18} /> Contact</Link></li>
//                 <li>
//                   <Button className="w-full bg-[#0a72bd] text-white flex items-center justify-center gap-2">
//                     <Rocket size={18} /> APPLY NOW
//                   </Button>
//                 </li>
//               </ul>
//             </SheetContent>
//           </Sheet>
//         </div>
//       </div>

//       {/* Desktop Navbar */}
//       <div className="hidden lg:flex px-4 py-3 justify-between items-center mt-4">
//         {/* Search */}
//         <Sheet open={isSearchOpen} onOpenChange={setIsSearchOpen}>
//           <SheetTrigger asChild>
//             <Button
//               className="bg-white text-[#0a72bd] rounded-xl w-[120px] px-4 py-2 shadow-md border border-gray-200 hover:scale-105 transition-transform h-14 hover:bg-[#f0f0f0]"
//             >
//               <Search className="mr-2 h-14 w-4" /> Search
//             </Button>
//           </SheetTrigger>
//         </Sheet>

//         {/* Center group */}
//         <div className="bg-white rounded-lg shadow-lg px-6 py-3 flex items-center space-x-15 border border-gray-100">
//           <Link href="/about" className="text-gray-800 hover:text-[#0a72bd] transition-colors font-medium">About</Link>

//           {/* People (dynamic mega menu) */}
//           <PeopleDropdown
//             isOpen={openDropdown === "People"}
//             onOpenChange={(isOpen) => handleOpenChange("People", isOpen)}
//           />

//           {/* Keep your other dropdowns as-is */}
//           {navDropdowns.slice(0, 1).map(dropdown => (
//             <NavDropdown
//               key={dropdown.title}
//               {...dropdown}
//               isOpen={openDropdown === dropdown.title}
//               onOpenChange={(isOpen) => handleOpenChange(dropdown.title, isOpen)}
//             />
//           ))}

//           {/* Center logo */}
//           <Link href="/" className="hover:scale-105 transition-transform">
//             <img src="/neon-logo.png" alt="NEON Logo" className="h-10 w-auto" />
//           </Link>

//           {navDropdowns.slice(1).map(dropdown => (
//             <NavDropdown
//               key={dropdown.title}
//               {...dropdown}
//               isOpen={openDropdown === dropdown.title}
//               onOpenChange={(isOpen) => handleOpenChange(dropdown.title, isOpen)}
//             />
//           ))}

//           <Link href="/contact" className="text-gray-800 hover:text-[#0a72bd] transition-colors font-medium">Contact</Link>
//         </div>

//         <Button className="bg-[#0a72bd] text-white font-semibold px-5 py-2 rounded-xl hover:scale-105 h-14 hover:bg-[#085a96]">
//           APPLY NOW
//         </Button>
//       </div>
//     </nav>
//   );
// }
