"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { UserAvatar } from "../../../../components/UserAvatar";
import { buttonVariants } from "@/components/ui/button";
import { useSidebar } from "@/store/use-sidebar";
import { cn } from "@/lib/utils";
import { LiveBadge } from "@/components/LiveBadge";
import { UserAvatarSkeleton } from "@/components/UserAvatar";
import { Skeleton } from "@/components/ui/skeleton";

interface UserItemProps {
  username: string | null;
  imageUrl: string | null;
  isLive: boolean;
}

export const UserItem = ({ username, imageUrl, isLive }: UserItemProps) => {
  const pathname = usePathname();
  const { collapsed } = useSidebar();

  if (!username) {
    return null;
  }

  const href = `/${username}`;
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        buttonVariants({ variant: "ghost" }),
        "w-full h-12",
        collapsed ? "justify-center" : "justify-start",
        isActive && "bg-accent"
      )}
    >
      <div className={cn("flex items-center gap-x-4 w-full", collapsed && "justify-center")}>
       
          <UserAvatar username={username} imageUrl={imageUrl ?? ""} isLive={isLive} />
    
          {!collapsed && <p className="truncate text-sm">{username}</p>}
          {!collapsed && isLive && <LiveBadge className='ml-auto'/>}
      </div>
    </Link>
  );
};

export const UserItemSkeleton = () => {
  return (
    <li className="flex items-center gap-x-4 px-3 py-2">
      <Skeleton className='min-h-8 min-w-8 rounded full'/>
      <div className='flex-1'>
        <Skeleton className='h-6'/>
        
      </div>
    </li>
  );
};