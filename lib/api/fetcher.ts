export const fetcher = (url: string) => fetch(url).then(r => r.json());

const WP = process.env.WP_GRAPHQL_ENDPOINT!;

/** Server-side WP GraphQL fetch with timeout + optional ISR */
export async function wpFetch<T = any>(
  query: string,
  variables: Record<string, any> = {},
  opts: { timeoutMs?: number; revalidate?: number } = {}
): Promise<{ data: T; errors?: any }> {
  const { timeoutMs = 8000, revalidate = 60 } = opts;
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);

  try {
    const res = await fetch(WP, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, variables }),
      signal: ctrl.signal,
      next: { revalidate },
    });
    clearTimeout(to);
    const json = await res.json();
    if (!res.ok || json?.errors) {
      console.error("WPGraphQL error:", json?.errors ?? res.statusText);
    }
    return json;
  } catch (e) {
    clearTimeout(to);
    console.error("WP fetch failed:", e);
    return { data: null as unknown as T, errors: e };
  }
}
