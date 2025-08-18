"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Props {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filters: string[];
  selectedFilters: string[];
  onToggleFilter: (filter: string) => void;
  onSearch: (query: string, filters: string[]) => void;
}

export default function SearchSheet({ isOpen, onOpenChange, filters, selectedFilters, onToggleFilter, onSearch }: Props) {
  const [q, setQ] = useState("");

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button className="bg-white text-[#0a72bd] rounded-xl w-[120px] px-4 py-2 shadow-md border border-gray-200 hover:scale-105 transition-transform h-14 hover:bg-[#f0f0f0]">
          <Search className="mr-2 h-14 w-4" /> Search
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="w-full sm:w-96 p-0">
        <SheetTitle>
          <VisuallyHidden>Search</VisuallyHidden>
        </SheetTitle>
        <div className="flex items-center gap-3 p-6 border-b">
          <Search className="h-5 w-5 text-[#0a72bd]" />
          <span className="text-lg font-medium text-gray-900">Search</span>
        </div>

        <div className="p-6 space-y-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSearch(q, selectedFilters);
            }}
          >
            <Input
              placeholder="What are you looking for?"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full border-[#0a72bd] focus:border-[#0a72bd] focus:ring-[#0a72bd] hover:scale-105 transition-transform"
            />
          </form>

          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Search in</h4>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <Button
                  key={filter}
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleFilter(filter)}
                  className={`text-xs px-3 py-1 rounded-full border cursor-pointer hover:scale-105 transition-transform ${
                    selectedFilters.includes(filter)
                      ? "bg-[#0a72bd] text-white border-[#0a72bd]"
                      : "border-gray-300 text-gray-700"
                  }`}
                >
                  {filter} <span className="ml-1 text-xs">+</span>
                </Button>
              ))}
            </div>
          </div>

          {selectedFilters.length > 0 && (
            <div>
              <h5 className="text-xs font-medium text-gray-600 mb-2">Selected filters ({selectedFilters.length}):</h5>
              <div className="flex flex-wrap gap-1">
                {selectedFilters.map((filter) => (
                  <span key={filter} className="inline-flex items-center gap-1 px-2 py-1 bg-[#0a72bd]/10 text-[#0a72bd] text-xs rounded-full">
                    {filter}
                    <button onClick={() => onToggleFilter(filter)} className="hover:scale-110 rounded-full p-0.5 transition-transform">
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}