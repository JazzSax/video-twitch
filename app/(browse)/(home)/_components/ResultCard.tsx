import type { FieldOutputTypes } from "@/prisma/schema.d";
import Link from "next/link";
import { Thumbnail, ThumbnailSkeleton } from "@/components/Thumbnail";
import { LiveBadge } from "@/components/LiveBadge";
import { UserAvatar, UserAvatarSkeleton } from "@/components/UserAvatar";
import { Skeleton } from "@/components/ui/skeleton";
type User = FieldOutputTypes["public"]["User"];

interface ResultCardProps {
  stream: {
    isLive: boolean;
    name: string;
    thumbnail: string | null;
    user: User;
  };
}

export const ResultCard = ({ stream }: ResultCardProps) => {
  return (
    <Link href={`/${stream.user.username}`}>
      <div className="h-full w-full space-y-4">
        <Thumbnail
          src={stream.thumbnail}
          fallback={stream.user.imageUrl ?? ""}
          alt={stream.user.username ?? ""}
          isLive={stream.isLive}
          username={stream.user.username ?? ""}
          
        />
        {
          stream.isLive && (
            <div className="absolute top-2 left-2 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform">
              <LiveBadge />
            </div>
          )
        }
        <div className="flex gap-x-3">
          <UserAvatar username={stream.user.username ?? ""} imageUrl={stream.user.imageUrl ?? ""} isLive={stream.isLive}/>
          <div className="flex- flex-col text-sm overflow-hidden">
            <p className="truncate font-semibold hover:text-blue-500">
              {stream.name}
            </p>
            <p className="text-muted-foreground">
              {stream.user.username}
            </p>
          </div>
        </div>
      </div>
    </Link>
    
  )
}

export const ResultCardSkeleton = () => {
  return (
    <div className="h-full w-full space-y-4">
      <ThumbnailSkeleton />
      <div className="flex gap-x-3">
        <UserAvatarSkeleton/>
        <div className="flex flex-col gap-y-1">
          <Skeleton className="h-4 w-32"/>
          <Skeleton className="h-4 w-24"/>
        </div>
      </div>
    </div>
  )
}