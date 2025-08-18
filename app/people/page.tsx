"use client";

import { Suspense } from "react";
import PeopleContent from "./PeopleContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PeopleContent />
    </Suspense>
  );
}
