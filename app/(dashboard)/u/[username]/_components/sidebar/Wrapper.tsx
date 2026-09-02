"use client";

import { useCreatorSidebar } from "@/store/use-creator-sidebar";
import { cn } from "@/lib/utils";

interface WrapperProps {
  children: React.ReactNode;
}
export const Wrapper = ({ children }: WrapperProps) => {
  const { collapsed } = useCreatorSidebar();
  return (
    <aside className={cn("fixed left-0 flex flex-col w-17.5 lg:w-60  h-full bg-[#252731] border-r border-[#2D2E35] z-50", collapsed && "lg:w-17.5" )}>
      {children}
    </aside>
  )
}