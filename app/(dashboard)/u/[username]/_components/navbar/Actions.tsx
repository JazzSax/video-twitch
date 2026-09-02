import Link from "next/link";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
export const Actions = () => {

  return (
    <div className="flex items-center justify-end gap-x-2">
      <Link href='/'  
      className={cn(
        buttonVariants({ variant: "ghost", size:"sm" }),
        "text-muted-foreground hover:text-primary"
      )}>
        <LogOut className="size-5 mr-2"/>
        Exit
      </Link>
      <UserButton />
    </div>
  );
};