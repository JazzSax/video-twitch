import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Results, ResultsSkeleton } from "./_components/Results";
import { Suspense } from "react";
export default async function Page() {

  return (
    <div className="h-full p-8 max-w-screen-2xl mx-auto">
      <Suspense fallback={<ResultsSkeleton/>}>
        <Results/>
      </Suspense>
    </div>
   
  );
}
