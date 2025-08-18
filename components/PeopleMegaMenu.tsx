"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { PeopleMenuCategory, PeopleMenuData } from "@/lib/peopleMenu";

type Props = {
  /** Pre-fetched data (recommended: call getPeopleMenu in a Server Component) */
  data?: PeopleMenuData;
  /** Optional: category slugs order if you want to filter/reorder at render time */
  slugsOrder?: string[];
  /** Max names per column to render (UI cap; backend also caps) */
  limit?: number;
  /** Path used for the “Show all” links (defaults to /people?cat=slug) */
  basePath?: string; // e.g. "/people"
  /** Add this to Links to skip exit animation for same-path query changes */
  noTransitionAttr?: boolean; // default true
  /** Hide “Show all” links */
  hideShowAll?: boolean;
  /** Class name for the dropdown container */
  className?: string;
};

export default function PeopleMegaMenu({
  data,
  slugsOrder,
  limit = 16,
  basePath = "/people",
  noTransitionAttr = true,
  hideShowAll = false,
  className = "",
}: Props) {
  const categories: PeopleMenuCategory[] = useMemo(() => {
    let cats = data?.categories ?? [];

    if (slugsOrder?.length) {
      const idx = Object.fromEntries(slugsOrder.map((s, i) => [s, i]));
      cats = cats
        .filter((c) => idx[c.slug] !== undefined)
        .sort((a, b) => (idx[a.slug] ?? 999) - (idx[b.slug] ?? 999));
    }

    return cats.map((c) => ({
      ...c,
      people: c.people.slice(0, limit),
    }));
  }, [data, slugsOrder, limit]);

  if (!categories.length) {
    return (
      <div
        className={`min-w-[720px] grid grid-cols-3 gap-6 p-6 rounded-xl shadow-xl bg-white ${className}`}
      >
        <div className="col-span-3 text-sm text-gray-500">
          No people found yet.
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-w-[960px] grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 p-6 rounded-xl shadow-xl bg-white ${className}`}
      role="menu"
      aria-label="People mega menu"
    >
      {categories.map((cat) => (
        <div key={cat.slug} className="min-w-[180px]">
          <div className="flex items-center justify-between">
            <Link
              href={`${basePath}?cat=${encodeURIComponent(cat.slug)}`}
              className="font-semibold text-[15px] text-rose-600 hover:text-rose-700"
              {...(noTransitionAttr ? { "data-no-transition": "" } : {})}
            >
              {cat.name}
            </Link>
            {!hideShowAll && (
              <Link
                href={`${basePath}?cat=${encodeURIComponent(cat.slug)}`}
                className="text-[12px] text-gray-500 hover:text-gray-700"
                {...(noTransitionAttr ? { "data-no-transition": "" } : {})}
              >
                Show all
              </Link>
            )}
          </div>

          <ul className="mt-3 space-y-2">
            {cat.people.map((p) => (
              <li key={p.slug} className="truncate">
                <Link
                  href={`/people/${encodeURIComponent(p.slug)}`}
                  className="group inline-flex items-center gap-1 text-[14px] text-gray-800 hover:text-black"
                  // detail pages are full navigations; allow transition if you want
                  {...(noTransitionAttr ? {} : { "data-no-transition": "" })}
                >
                  <span className="truncate">{p.title}</span>
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}