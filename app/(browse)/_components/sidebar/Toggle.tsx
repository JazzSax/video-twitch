"use client";
import { useSidebar } from "@/store/use-sidebar";
import { Button } from "@/components/ui/button";
import { Hint } from "@/components/Hint";
import { ArrowLeftFromLine, ArrowRightToLine } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
export const Toggle = () => {
  const {collapsed, onExpand, onCollapse} = useSidebar();
  const label = collapsed ? "Expand" : "Collapse";
  return (
    <>
      {
        collapsed && (
          <div className="hidden lg:flex w-full items-center justify-center pt-4 mb-4">
            <Hint label={label} side="right" asChild={true}>
              <Button className="h-auto p-2" variant="ghost" onClick={onExpand}>
                <ArrowRightToLine className="w-4 h-4" />
              </Button>
            </Hint>
          </div>
        )
      }
      {
        !collapsed && (
          <div className="p-3 pl-6 mb-2 flex items-center w-full">
            <p className="font-semibild text-primary">
              For you
            </p>
            <Hint label={label} side="right" asChild={true}>
              <Button className="h-auto p-2 ml-auto" variant="ghost" onClick={onCollapse}>
                <ArrowLeftFromLine className="w-4 h-4" />
              </Button>
            </Hint>
          </div>
        )
      }
   
    </>
  );
};

export const ToggleSkeleton = () => {
  return (
    <div className="p-3 pl-6 mb-2 hidden lg:flex items-center w-full">
      <Skeleton className="h-6 w-25" />
      <Skeleton className="h-6 w-6" />
    </div>
  );
};