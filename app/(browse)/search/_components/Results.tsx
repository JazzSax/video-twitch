import { Skeleton } from "@/components/ui/skeleton";
import { getSearch } from "@/lib/search-service";
import { ResultCard, ResultCardSkeleton } from "./ResultCard";
interface ResultsProps {
  term: string;
}

export const Results = async ({ term }: ResultsProps) => {
  const streams = await getSearch(term);
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Results for term &quot;{term}&quot;</h2>
      {
        streams.length===0  && (
          <p className="text-muted-foreground text-sm">
            No results found. Try a different search term.
          </p>
        )
      }
      <div className="flex flex-col gap-y-4">
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
      <Skeleton className="h-8 w-[290px] mb-4" />
      <div className="space-y-4">
        <ResultCardSkeleton />
        <ResultCardSkeleton />
        <ResultCardSkeleton />
        <ResultCardSkeleton />
      </div>
    </div>
  )
}