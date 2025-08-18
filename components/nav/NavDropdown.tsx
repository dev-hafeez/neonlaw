"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { DropdownProps } from "./types";

const menuVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
  exit: { opacity: 0, y: 8, transition: { duration: 0.2 } },
};

export default function NavDropdown({ title, links, isOpen, onOpenChange }: DropdownProps) {
  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger className="flex items-center gap-1 text-gray-800 hover:text-[#0a72bd] transition-colors font-medium cursor-pointer">
        {title} <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent
            align="start"
            sideOffset={10}
            className="w-64 p-0 border-none rounded-lg shadow-2xl overflow-hidden mt-0"
            asChild
            forceMount
          >
            <motion.div
              variants={menuVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="p-4 bg-white space-y-2"
            >
              {links.map((link) => (
                <DropdownMenuItem key={link.title} className="p-0 focus:bg-transparent">
                  <Link
                    href={link.href}
                    className={`block w-full py-2 px-3 text-gray-700 rounded-md transition-colors ${link.showAll ? "font-bold text-[#0a72bd] mt-2 border-t pt-3" : "hover:bg-gray-100"}`}
                    onClick={() => onOpenChange(false)}
                  >
                    {link.title}
                  </Link>
                </DropdownMenuItem>
              ))}
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
}