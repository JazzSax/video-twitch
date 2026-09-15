import type { SearchStream } from "@/lib/search-service";
import { Thumbnail, ThumbnailSkeleton } from "@/components/Thumbnail";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { VerifiedMark } from "@/components/VerifiedMark";
import { Skeleton } from "@/components/ui/skeleton";
interface ResultCardProps {
  stream: SearchStream;
}

export const ResultCard = ({ stream }: ResultCardProps) => {
  return (
    <Link href={`/${stream.user.username}`}>
      <div className="w-full flex gap-x-4">
        <div className="relative h-36 w-64">
          <Thumbnail src={stream.thumbnail ?? ""} alt={stream.name} isLive={stream.isLive} fallback={stream.user.imageUrl ?? ""} username={stream.user.username ?? ""} />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-x-2">
            <p className="font-bold text-lg cursor-pointer hover:text-blue-500">
              {stream.user.username}
            </p>
            <VerifiedMark/>
          </div>
          <p className="text-sm text-muted-foreground">
            {stream.name}
          </p>
          <p className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(stream.updatedAt), { addSuffix: true })}
          </p>
        </div>

      </div>
    </Link>
  )
};

export const ResultCardSkeleton = () => {
  return (
    <div className="w-full flex gap-x-4">
      <div className="relative h-36 w-64">
        <ThumbnailSkeleton />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-24" />
      </div>
    </div>
  )
}