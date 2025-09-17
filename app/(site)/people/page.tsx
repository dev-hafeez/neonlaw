"use client";

import { Suspense } from "react";
import PeopleContent from "@/components/people/PeopleContent";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-0 bg-white">
        <img src="/Blue.png" alt="NEON Background Logo" className="w-150 h-150 object-contain" />
      </div>
      <PeopleContent />
    </Suspense>
  );
}
