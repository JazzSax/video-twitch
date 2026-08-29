import Image from "next/image";
import { Button } from "@/components/ui/button";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
export default async function Home() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }
  return (
    <div>
      <UserButton />
    </div>
   
  );
}
