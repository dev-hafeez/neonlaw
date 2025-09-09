import { Suspense } from "react";
import CareerClient from "./CareerClient";

export default function Career() {
  return (
    <Suspense fallback={<div />}> 
      <CareerClient />
    </Suspense>
  );
}
