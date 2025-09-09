"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu, Info, Users, Brain, Newspaper, Briefcase, Mail, Rocket } from "lucide-react";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MobileMenu({ isOpen, onOpenChange }: Props) {
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-[#0a72bd]">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64 p-6 space-y-4">
        <SheetTitle>Menu</SheetTitle>
        <ul className="space-y-3">
          <li>
            <Link href="/about" className="flex items-center gap-2 text-[#0a72bd]"><Info size={18} /> About</Link>
          </li>
          <li>
            <Link href="/people" className="flex items-center gap-2 text-[#0a72bd]"><Users size={18} /> People</Link>
          </li>
          <li>
            <Link href="/expertise" className="flex items-center gap-2 text-[#0a72bd]"><Brain size={18} /> Expertise</Link>
          </li>
          <li>
            <Link href="/news" className="flex items-center gap-2 text-[#0a72bd]"><Newspaper size={18} /> News</Link>
          </li>
          <li>
            <Link href="/career" className="flex items-center gap-2 text-[#0a72bd]"><Briefcase size={18} /> Career</Link>
          </li>
          <li>
            <Link href="/contact" className="flex items-center gap-2 text-[#0a72bd]"><Mail size={18} /> Contact</Link>
          </li>
          <li>
            <Button className="w-full bg-[#0a72bd] text-white flex items-center justify-center gap-2">
              <Rocket size={18} /> APPLY NOW
            </Button>
          </li>
        </ul>
      </SheetContent>
    </Sheet>
  );
}