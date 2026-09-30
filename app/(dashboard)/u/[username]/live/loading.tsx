import { Skeleton } from "@/components/ui/skeleton";

function LiveLoading() {
  return (
    <div className='p-6 space-y-4'>
      <Skeleton className='h-10 w-50'/>
      <Skeleton className='aspect-video w-full max-w-3xl rounded-xl'/>
      <div className='flex gap-4'>
        <Skeleton className='h-8 w-60'/>
        <Skeleton className='h-8 w-60'/>
      </div>
    </div>
  );
};

export default LiveLoading;
