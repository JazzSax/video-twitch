import { getStreams } from "@/lib/feed-service";
import { ResultCard } from "./ResultCard";
import { ResultCardSkeleton } from "./ResultCard";
import { Skeleton } from "@/components/ui/skeleton";
export const Results = async () => {
  const streams = await getStreams();
  return (
    <div>
      <h2>Streams we think you&apos;ll like</h2>
      {
        streams.length === 0 && <div className="text-muted-foreground text-sm">No streams found</div> 
      }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {
          streams.map((stream) => (
            <ResultCard key={stream.id} stream={stream} />
          ))
        }
      </div>
    </div>
  )
}

export const ResultsSkeleton = () => {
  return (
    <div>
      <Skeleton className="h-8 w-[290px] mb-4"/>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {
          Array.from({ length: 4 }).map((_, index) => (
            <ResultCardSkeleton key={index} />
          ))
        }
      </div>
    </div>
  )
}