"use client";
import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useCreatorSidebar } from "@/store/use-creator-sidebar";
import { Skeleton } from "@/components/ui/skeleton";

interface NavItemProps {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
}

export const NavItem = ({ href, icon: Icon, label, isActive }: NavItemProps) => {
  const { collapsed } = useCreatorSidebar();
  return (
    <li>
      <Link href={href} className={cn(
        buttonVariants({ variant: "ghost", size:"sm" }), 
        "w-full h-12",
        collapsed ? "justify-center" : "justify-start",
        isActive && "bg-accent"
      )}>
        <div className="flex items-center gap-x-4">
          <Icon className={cn("size-4", collapsed ? "mr-0" : "mr-2")} />
          {!collapsed && <span>{label}</span>}
        </div>
      </Link>
    </li>
  )
}

export const NavItemSkeleton = () => {
  return (
    <li className="flex items-center gap-x-4 px-3 py-2">
      <Skeleton className="min-h-12 min-w-12 rounded-md" />
      <div className='flex-1 hidden lg:block'>
        <Skeleton className="h-6" />
      </div>
    </li>
  )
}