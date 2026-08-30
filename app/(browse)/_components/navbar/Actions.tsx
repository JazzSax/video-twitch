import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { Clapperboard } from "lucide-react";
export const Actions = async () => {
  const user = await currentUser();
  return (
    <div className="flex items-center justify-end gap-x-4 ml-4">
      {
        !user && (
          <SignInButton>
            <Button size="sm" variant="primary" className="rounded-sm">Login</Button>
          </SignInButton>
        )
      }
      {
        !!user && (
          <div className="flex items-center gap-x-4">
            <Link href={`/u/${user.username}`} className="flex items-center gap-x-2 text-muted-foreground hover:text-primary">
              <Clapperboard className="w-4 h-4 lg:mr-2"/>
              <span className="hidden lg:block">
                Dashboard
              </span>
            </Link>
            <UserButton />
          </div>
        )
      }
    </div>
  );
};