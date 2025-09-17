import { Suspense } from "react";
import NewsClient from "./NewsClient";

export default function NewsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewsClient />
    </Suspense>
  );
}
