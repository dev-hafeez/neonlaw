
export type PeopleMenuItem = {
  title: string; // person's display name
  slug: string;  // e.g. "john-dhoe"
};

export type PeopleMenuCategory = {
  name: string;  // e.g. "Finance"
  slug: string;  // e.g. "finance"
  people: PeopleMenuItem[];
};

export type PeopleMenuData = {
  categories: PeopleMenuCategory[];
  error?: string;
};

const DEFAULT_LIMIT = 16;

/**
 * Server-safe fetcher: call from RSC or route handlers.
 * Optional params:
 *  - limit: max people per category
 *  - slugs: explicit category slugs order (comma-separated)
 */
export async function getPeopleMenu(params?: {
  limit?: number;
  slugs?: string[]; // keeps order
}): Promise<PeopleMenuData> {
  const url = new URL(`${process.env.NEXT_PUBLIC_SITE_BASE ?? ""}/api/people-menu`, "http://localhost");
  const limit = params?.limit ?? DEFAULT_LIMIT;
  if (limit) url.searchParams.set("limit", String(limit));
  if (params?.slugs?.length) url.searchParams.set("slugs", params.slugs.join(","));

  // NOTE: When NEXT_PUBLIC_SITE_BASE is unset, we still use a relative URL at runtime on the client.
  const res = await fetch(url.toString().replace("http://localhost", ""), {
    // RSC-friendly caching (route sets s-maxage)
    next: { revalidate: 300 },
  });

  try {
    const json = (await res.json()) as PeopleMenuData;
    return json;
  } catch {
    return { categories: [], error: "Invalid JSON from /api/people-menu" };
  }
}

/**
 * Client hook version using SWR (optional).
 * If you don't use SWR, you can remove this and fetch in the component with useEffect.
 */
export function usePeopleMenu(opts?: { limit?: number; slugs?: string[] }) {
  // Avoid importing SWR in server context
  if (typeof window === "undefined") {
    throw new Error("usePeopleMenu must be used in a client component");
  }
  // Lazy import so this file is safe in server bundles too
  // @ts-ignore
  return import("swr").then((module) => {
    const useSWR = module.default as <T>(key: string, fetcher: (key: string) => Promise<T>) => {
      data?: T;
      error?: any;
      isLoading: boolean;
      mutate: () => Promise<any>;
    };

    const qs = new URLSearchParams();
    if (opts?.limit) qs.set("limit", String(opts.limit));
    if (opts?.slugs?.length) qs.set("slugs", opts.slugs.join(","));
    const key = `/api/people-menu?${qs.toString()}`;

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const swr = useSWR<PeopleMenuData>(key, (k: string) =>
      fetch(k).then((r) => r.json())
    );
    return swr;
  });
}