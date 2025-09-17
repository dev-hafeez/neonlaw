import { Suspense } from "react";
import Career from "./Career";

export default function CareerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Career />
    </Suspense>
  );
}
