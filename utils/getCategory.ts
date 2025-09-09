// utils/getCategory.ts
import { ReadonlyURLSearchParams } from "next/navigation";

export function getCategory(searchParams: ReadonlyURLSearchParams | null): string {
  if (!searchParams) return "";
  return searchParams.get("category") ?? "";
}
