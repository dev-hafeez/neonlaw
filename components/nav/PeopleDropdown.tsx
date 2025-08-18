"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronRight } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { PeopleMenuData } from "@/lib/peopleMenu";

const ROW_H = 40; // must match h-10

// Types local to this file to mirror your API response
type PeopleMenuItem = { title: string; slug: string };

type Props = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  slugsOrder?: string[];
  limit?: number;
};

export default function PeopleDropdown({
  isOpen,
  onOpenChange,
  slugsOrder = [
    "corporate",
    "disputes",
    "finance",
    "ma",
    "notarial-service",
    "private-equity",
    "real-estate",
    "tax",
    "tech-data",
    "venture-capital",
    "people-culture",
    "operations",
    "marketing",
  ],
  limit = 16,
}: Props) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PeopleMenuData | null>(null);

  // fetch once on first open
  useEffect(() => {
    if (!isOpen || data || loading) return;
    setLoading(true);
    const qs = new URLSearchParams({ limit: String(limit), slugs: slugsOrder.join(",") });
    fetch(`/api/people-menu?${qs.toString()}`)
      .then((r) => r.json())
      .then((json: PeopleMenuData) => setData(json))
      .catch(() => setData({ categories: [], error: "Failed to load menu" }))
      .finally(() => setLoading(false));
  }, [isOpen, data, loading, slugsOrder, limit]);

  const labelFromSlug = (slug: string) => slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

  // normalize to always show all slugs, keep order
  const map = new Map<string, { name: string; people: PeopleMenuItem[] }>();
  (data?.categories ?? []).forEach((c) => map.set(c.slug, { name: c.name || labelFromSlug(c.slug), people: c.people || [] }));
  const cats = slugsOrder.map((slug) => {
    const e = map.get(slug);
    return {
      slug,
      name: e?.name || labelFromSlug(slug),
      people: (e?.people || []).slice(0, limit).sort((a, b) => a.title.localeCompare(b.title)),
    };
  });

  // fly-out state
  const firstWithPeople = cats.find((c) => c.people.length)?.slug ?? cats[0]?.slug ?? "";
  const [activeSlug, setActiveSlug] = useState(firstWithPeople);
  const [flyTop, setFlyTop] = useState(0); // px from top of left list
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!activeSlug && cats.length) setActiveSlug(firstWithPeople);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  function openFlyout(slug: string, rowIndex: number) {
    setActiveSlug(slug);
    const scrollTop = listRef.current?.scrollTop ?? 0;
    const top = rowIndex * ROW_H - scrollTop;
    setFlyTop(Math.max(8, top));
  }

  const activeCat = cats.find((c) => c.slug === activeSlug) || cats[0];

  return (
    <DropdownMenu open={isOpen} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger className="flex items-center gap-1 text-gray-800 hover:text-[#0a72bd] transition-colors font-medium cursor-pointer">
        People <ChevronDown className="h-4 w-4" />
      </DropdownMenuTrigger>

      <AnimatePresence>
        {isOpen && (
          <DropdownMenuContent
            align="start"
            sideOffset={10}
            className="p-0 border-none rounded-xl shadow-2xl overflow-visible mt-0"
            asChild
            forceMount
          >
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.18 }}>
              {/* Make this relative so the fly-out positions next to it */}
              <div className="relative bg-white w-[240px] max-w-[92vw]">
                {loading ? (
                  <div className="p-6 text-sm text-gray-500">Loading…</div>
                ) : (
                  <>
                    {/* LEFT: categories list */}
                    <div ref={listRef} className="max-h-[48vh] overflow-y-auto rounded-l-xl">
                      <ul className="py-1">
                        {cats.map((c, idx) => {
                          const selected = c.slug === activeSlug;
                          return (
                            <li key={c.slug} className="group">
                              <div className="w-full h-10 px-3 flex items-center justify-between">
                                {/* Label → category page */}
                                <Link
                                  href={`/people?cat=${encodeURIComponent(c.slug)}`}
                                  data-no-transition
                                  onClick={() => onOpenChange(false)}
                                  className={`truncate text-sm hover:text-black ${selected ? "text-rose-600 font-semibold" : "text-gray-900"}`}
                                >
                                  {c.name}
                                </Link>

                                {/* Arrow → open fly-out next to this row */}
                                <button
                                  type="button"
                                  aria-label="Show people"
                                  className={`ml-2 p-1 rounded-md transition-colors ${selected ? "text-rose-600" : "text-gray-400 group-hover:text-gray-600"}`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    openFlyout(c.slug, idx);
                                  }}
                                  onMouseEnter={() => openFlyout(c.slug, idx)}
                                >
                                  <ChevronRight className="h-5 w-5" />
                                </button>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>

                    {/* RIGHT FLY-OUT: names panel */}
                    <div
                      className="absolute left-[248px] w-[360px] max-w-[60vw] max-h-[48vh] overflow-auto bg-white rounded-xl shadow-xl border"
                      style={{ top: flyTop }}
                    >
                      <div className="flex items-center justify-between px-3 py-2 border-b">
                        <div className="text-[14px] font-semibold truncate">{activeCat?.name}</div>
                        <Link
                          href={`/people?cat=${encodeURIComponent(activeCat.slug)}`}
                          className="text-[11px] text-gray-500 hover:text-gray-700"
                          data-no-transition
                          onClick={() => onOpenChange(false)}
                        >
                          Show all
                        </Link>
                      </div>

                      {activeCat?.people?.length ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-1.5 p-3">
                          {activeCat.people.map((p) => (
                            <Link
                              key={p.slug}
                              href={`/people/${encodeURIComponent(p.slug)}`}
                              className="text-[13px] text-gray-800 hover:text-black truncate"
                              onClick={() => onOpenChange(false)}
                            >
                              {p.title}
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 text-[12px] text-gray-400">No people yet</div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </DropdownMenuContent>
        )}
      </AnimatePresence>
    </DropdownMenu>
  );
}