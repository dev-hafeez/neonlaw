import { Suspense } from "react";
import NewsClient from "./NewsClient";

export default function News() {
  return (
    <Suspense fallback={<div />}> 
      <NewsClient />
    </Suspense>
  );
}
