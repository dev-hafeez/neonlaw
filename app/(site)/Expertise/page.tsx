"use client";

import { Suspense } from "react";
import Expertise from "./ExpertiseContent";

export default function ExpertisePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Expertise />
    </Suspense>
  );
}
