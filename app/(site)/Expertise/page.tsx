import { Suspense } from "react";
import ExpertiseClient from "./ExpertiseClient";

export default function ExpertisePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ExpertiseClient />
    </Suspense>
  );
}
