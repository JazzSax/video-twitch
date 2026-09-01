"use client";
import { useSidebar } from "@/store/use-sidebar";
import { cn } from "@/lib/utils";
import { ToggleSkeleton } from "./Toggle";
import { RecommendedSkeleton } from "./Recommended";
import { useIsClient } from "usehooks-ts";
interface WrapperProps {
  children: React.ReactNode;
}

export const Wrapper = ({ children }: WrapperProps) => {
  const isClient = useIsClient();
  const {collapsed} = useSidebar();
    
  if (!isClient) {
    return <WrapperSkeleton />;
  }
    return (
      <aside className={cn("fixed left-0 flex flex-col h-full bg-[#252731] border-r border-[#2D2E35]", collapsed ? "w-17.5" : "w-60")}>
      {children}
    </aside>
  );
};

const WrapperSkeleton = () => {
  return (
    <aside className={cn("fixed left-0 flex flex-col h-full bg-[#252731] border-r border-[#2D2E35]", "w-17.5")}>
      <ToggleSkeleton />
      <RecommendedSkeleton />
    </aside>
  );
};