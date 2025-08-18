"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { DropdownProps } from "./types";

const menuVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.2 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};
const itemVariants = {
  initial: { opacity: 0, y: -5 },
  animate: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.05 } }),
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
            className="w-64 p-0 border-none rounded-b-lg shadow-2xl overflow-hidden mt-0 rounded-t-none"
            asChild
            forceMount
          >
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
}