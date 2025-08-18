"use client";

import Link from "next/link";
import { useMemo } from "react";
import type { PeopleMenuCategory, PeopleMenuData } from "@/lib/peopleMenu";

type Props = {
  data?: PeopleMenuData;
  slugsOrder?: string[];
  limit?: number;
  basePath?: string;
  noTransitionAttr?: boolean;
  hideShowAll?: boolean;
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
  // normalize categories so all slugs in slugsOrder appear
  const categories: PeopleMenuCategory[] = useMemo(() => {
    const apiCats = data?.categories ?? [];
    const map = new Map(apiCats.map((c) => [c.slug, c]));
    if (slugsOrder?.length) {
      return slugsOrder.map((slug) => {
        const c = map.get(slug);
        return {
          slug,
          name: c?.name ?? slug.replace(/-/g, " ").replace(/\b\w/g, (m) => m.toUpperCase()),
          people: (c?.people ?? []).slice(0, limit),
        };
      });
    }
    return apiCats.map((c) => ({ ...c, people: c.people.slice(0, limit) }));
  }, [data, slugsOrder, limit]);

  if (!categories.length) {
    return (
      <div
        className={`min-w-[720px] grid grid-cols-3 gap-6 p-6 rounded-xl shadow-xl bg-white ${className}`}
      >
        <div className="col-span-3 text-sm text-gray-500">No people found yet.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <div
        role="menu"
        aria-label="People mega menu"
        className={[
          // "overflow-visible max-h-none",
          "min-w-[960px] grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8",
          "p-6 rounded-xl shadow-xl bg-white",
          className,
        ].join(" ")}
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

      {/* footer full-width link */}
      <div className="px-6 pb-4">
        <Link
          href={basePath}
          className="mt-4 block w-full rounded-lg border border-dashed px-4 py-3 text-center text-sm text-gray-700 hover:bg-gray-50"
          {...(noTransitionAttr ? { "data-no-transition": "" } : {})}
        >
          Show all People →
        </Link>
      </div>
    </div>
  );
}
