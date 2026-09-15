import Image from "next/image";
import { UserAvatar } from "./UserAvatar";
import { Skeleton } from "./ui/skeleton";
interface ThumbnailProps {
  src: string | null;
  fallback: string;
  alt: string;
  isLive: boolean;
  username: string;
}

export const Thumbnail = ({ src, fallback, alt, isLive, username }: ThumbnailProps) => {
  let content;
  if(!src) {
    content= (
      <div className="bg-[#0E0E0E] flex flex-col  items-center justify-center gap-y-4 h-full w-full transition-transform group-hover:translate-x-2 group-hover:-translate-y-1 rounded-md">
        <UserAvatar username={username} imageUrl={fallback} size="lg" showBadge isLive={isLive} />
      </div>
    )
  } else {
    content = <Image src={src} fill className="object-cover rounded-md transition-transform group-hover:translate-x-2 group-hover:-translate-y-2" alt={alt} />
  }
  return (
    <div className="group aspect-video relative rounded-md cursor-pointer">
      <div className="rounded-md absolute inset-0 bg-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
      

      </div>
      {content}
    
    </div>
  )
}

export const ThumbnailSkeleton = () => {
  return (
    <div className="group aspect-video relative rounded-xl cursor-pointer">
      <Skeleton className="h-full w-full"/>
      
    </div>
  )
}