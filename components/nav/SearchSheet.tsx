"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearch } from "@/components/context/SearchContext";

type ResultItem =
  | { type: "post"; title: string; url: string; label: string | null }
  | { type: "person"; title: string; url: string; label: string | null; meta?: string | null };

type Props = {
  onClose?: () => void;
  initialQuery?: string;
  initialChips?: string[];
};

type Chip = { name: string; slug: string };

const TOP_LEVEL_CHIPS: Chip[] = [
  { name: "News", slug: "news" },
  { name: "Career", slug: "career" },
  { name: "Culture", slug: "culture" },
  { name: "Insights", slug: "insights" },
  { name: "Compensation Career", slug: "compensation_career" },
  { name: "Career Development", slug: "career_development" },
  { name: "Jobs", slug: "jobs" },
  { name: "Expertise", slug: "expertise" },
  { name: "About", slug: "about" },
  { name: "People", slug: "people" },
];

const DEFAULT_SELECTED = TOP_LEVEL_CHIPS.map((c) => c.slug);

export default function SearchSheet({ onClose, initialQuery = "", initialChips }: Props) {
  const { searchQuery, searchCategories, setSearchQuery, setSearchCategories } = useSearch();
  const [query, setQuery] = useState(initialQuery || searchQuery);
  const [chips, setChips] = useState<string[]>(
    Array.isArray(initialChips) && initialChips.length > 0
      ? initialChips
      : searchCategories.length > 0
      ? searchCategories
      : DEFAULT_SELECTED
  );
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ResultItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<number | null>(null);

  const catsParam = useMemo(() => chips.join(","), [chips]);
  const hasPeople = chips.includes("people");

  const fetchResults = useCallback(async (q: string, cats: string) => {
    setLoading(true);
    setError(null);
    try {
      const u = new URL("/api/search", window.location.origin);
      if (q.trim()) u.searchParams.set("q", q.trim());
      if (cats) u.searchParams.set("cats", cats);
      u.searchParams.set("limit", "10");

      const r = await fetch(u.toString(), { cache: "no-store" });
      const json = await r.json();
      if (!r.ok || json?.ok === false) throw new Error(json?.error || r.statusText);
      setResults((json?.results as ResultItem[]) || []);
    } catch (e: any) {
      setError(e?.message || "Search failed");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => fetchResults(query, catsParam), 250);
    return () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    };
  }, [query, catsParam, fetchResults]);

  const toggleChip = (slug: string) => {
    const newChips = chips.includes(slug) ? chips.filter((c) => c !== slug) : [...chips, slug];
    setChips(newChips);
    setSearchCategories(newChips);
  };
  
  const removeChip = (slug: string) => {
    const newChips = chips.filter((c) => c !== slug);
    setChips(newChips);
    setSearchCategories(newChips);
  };

  return (
    <div className="p-5 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" className="shrink-0">
            <path
              d="M21 21l-4.3-4.3M10 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
              fill="none"
              stroke="#0a72bd"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <h2 className="text-xl font-semibold">Search</h2>
        </div>
      </div>

      <input
        value={query}
        onChange={(e) => {
          const newQuery = e.target.value;
          setQuery(newQuery);
          setSearchQuery(newQuery);
        }}
        placeholder="What are you looking for?"
        className="w-full rounded-lg border border-gray-300 px-3 py-3 outline-none focus:ring-2 focus:ring-[#0a72bd]"
      />

      <div className="mt-5">
        <p className="mb-2 text-sm font-medium text-gray-700">Search in</p>
        <div className="flex flex-wrap gap-2">
          {TOP_LEVEL_CHIPS.map(({ slug, name }) => {
            const active = chips.includes(slug);
            return (
              <button
                key={slug}
                onClick={() => toggleChip(slug)}
                className={
                  "rounded-full border px-3 py-1.5 text-sm transition-colors " +
                  (active
                    ? "bg-[#0a72bd] text-white border-[#0a72bd]"
                    : "bg-white text-gray-800 border-gray-300 hover:border-[#0a72bd]")
                }
              >
                {name} {active && <span className="ml-1">×</span>}
              </button>
            );
          })}
        </div>
        <p className="mt-3 text-xs text-gray-500">
          Tip: Click chips to include/exclude sections. Active: {chips.length}
        </p>
      </div>

      <div className="mt-6">
        <div className="mb-3 text-sm text-gray-700 font-medium">
          Results ({results.length})
        </div>
        <div className="space-y-3">
        {loading && <div className="text-sm text-gray-600">Searching…</div>}
        {error && <div className="text-sm text-red-600">Error: {error}</div>}
        {!loading && !error && results.length === 0 && (
          <div className="text-sm text-gray-500">No results.</div>
        )}
        {!loading &&
          !error &&
          results.map((r, i) => (
            <div key={i} className="flex items-center justify-between">
              <Link href={r.url} onClick={onClose} className="text-[#0a72bd] underline">
                {r.title}
              </Link>
              <span className="ml-3 text-xs text-gray-600 rounded-full bg-gray-100 px-2 py-0.5">
                {r.type === "person" ? r.meta || "People" : r.label || "Post"}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 text-xs text-gray-500">
        {hasPeople
          ? "Showing posts and people (People filter is selected)."
          : "Showing posts. Select 'People' to include people results."}
      </div>
      
      <div className="mt-3 text-xs text-[#0a72bd] font-medium">
        ✓ Search is now active - Pinterest masonry will show filtered results
      </div>
    </div>
  );
}
