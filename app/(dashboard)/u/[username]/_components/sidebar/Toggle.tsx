"use client";

import { useCreatorSidebar } from "@/store/use-creator-sidebar";
import { Button } from "@/components/ui/button";
import { ArrowRightFromLine, ArrowLeftFromLine } from "lucide-react";
import { Hint } from "@/components/Hint";

export const Toggle = () => {
  const { collapsed, onExpand, onCollapse } = useCreatorSidebar();
  const label = collapsed ? "Expand" : "Collapse";
  return (
    <>
      {
        collapsed && (
          <div className='w-full hidden lg:flex items-center justify-center pt-4 mb-4'>
            <Hint label={label} side="right" asChild>
              <Button variant="ghost" size="icon" onClick={onExpand} className="h-auto p-2">
                <ArrowRightFromLine className="size-4" />
              </Button>
            </Hint>
          </div>
        )
      }
      {
        !collapsed && (
          <div className='p-3 pl-6 mb-2 w-full hidden lg:flex items-center'>
            <p className="font-semibold text-primary">
              Dashboard
            </p>
            <Hint label={label} side="right" asChild>
              <Button variant="ghost" size="icon" onClick={onCollapse} className="h-auto p-2 ml-auto">
                <ArrowLeftFromLine className="size-4" />
              </Button>
            </Hint>
          </div>
        )
      }
    </>
  )
}