// "use client";

// import { useState } from "react";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Search } from "lucide-react";

// import NavDropdown from "./NavDropdown";
// import PeopleDropdown from "./PeopleDropdown";
// import SearchSheet from "./SearchSheet";
// import MobileMenu from "./MobileMenu";
// import type { NavLink } from "./types";

// export default function Navbar() {
//   const [isSearchOpen, setIsSearchOpen] = useState(false);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
//   const [selectedFilters, setSelectedFilters] = useState<string[]>(["About"]);
//   const [openDropdown, setOpenDropdown] = useState<string | null>(null);

//   const handleOpenChange = (title: string, isOpen: boolean) => setOpenDropdown(isOpen ? title : openDropdown === title ? null : openDropdown);

//   const filters = [
//     "News",
//     "Career",
//     "Culture",
//     "Insights",
//     "Compensation & Benefits",
//     "Career Development",
//     "Jobs",
//     "Expertise",
//     "About",
//     "People",
//   ];

//   const navDropdowns: { title: string; links: NavLink[] }[] = [
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

//   const onToggleFilter = (filter: string) =>
//     setSelectedFilters((prev) => (prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]));

//   const onSearch = (query: string, filters: string[]) => {
//     // TODO: wire your search route
//     console.log("Searching for:", query, "in filters:", filters);
//   };

//   return (
//     <nav className="fixed top-0 left-0 right-0 z-50">
//       {/* Mobile Navbar */}
//       <div className="flex lg:hidden bg-white w-full px-4 py-3 shadow-lg border-b justify-between items-center">
//         <Link href="/">
//           <img src="/neon-logo.png" alt="NEON Logo" className="h-9 w-auto" />
//         </Link>
//         <div className="flex gap-2 items-center">
//           {/* Mobile Search (reuse SearchSheet trigger) */}
//           <SearchSheet
//             isOpen={isSearchOpen}
//             onOpenChange={setIsSearchOpen}
//             filters={filters}
//             selectedFilters={selectedFilters}
//             onToggleFilter={onToggleFilter}
//             onSearch={onSearch}
//           />
//           {/* Mobile Menu */}
//           <MobileMenu isOpen={isMenuOpen} onOpenChange={setIsMenuOpen} />
//         </div>
//       </div>

//       {/* Desktop Navbar */}
//       <div className="hidden lg:flex px-4 py-3 justify-between items-center mt-4">
//         {/* Search */}
//         <SearchSheet
//           isOpen={isSearchOpen}
//           onOpenChange={setIsSearchOpen}
//           filters={filters}
//           selectedFilters={selectedFilters}
//           onToggleFilter={onToggleFilter}
//           onSearch={onSearch}
//         />

//         {/* Center group */}
//         <div className="bg-white rounded-lg shadow-lg px-6 py-3 flex items-center space-x-15 border border-gray-100">
//           <Link href="/about" className="text-gray-800 hover:text-[#0a72bd] transition-colors font-medium">
//             About
//           </Link>

//           {/* People (dynamic mega menu) */}
//           <PeopleDropdown isOpen={openDropdown === "People"} onOpenChange={(isOpen) => handleOpenChange("People", isOpen)} />

//           {/* Other dropdowns */}
//           {navDropdowns.slice(0, 1).map((dropdown) => (
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

//           {navDropdowns.slice(1).map((dropdown) => (
//             <NavDropdown
//               key={dropdown.title}
//               {...dropdown}
//               isOpen={openDropdown === dropdown.title}
//               onOpenChange={(isOpen) => handleOpenChange(dropdown.title, isOpen)}
//             />
//           ))}

//           <Link href="/contact" className="text-gray-800 hover:text-[#0a72bd] transition-colors font-medium">
//             Contact
//           </Link>
//         </div>

//         <Button className="bg-[#0a72bd] text-white font-semibold px-5 py-2 rounded-xl hover:scale-105 h-14 hover:bg-[#085a96]">
//           APPLY NOW
//         </Button>
//       </div>
//     </nav>
//   );
// }