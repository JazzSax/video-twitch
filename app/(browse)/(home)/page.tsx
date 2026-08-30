import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
export default async function Home() {

  return (
    <div className="flex flex-col gap-y-4">
      Home Page
    </div>
   
  );
}
