import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { LiveBadge } from "@/components/LiveBadge";

const avatarVariants = cva("", {
  variants: {
    size: {
      default: "size-8",
      sm: "size-6",
      lg: "size-14",
    },
  },
  defaultVariants: {
    size: "default",
  },
});
interface UserAvatarProps extends VariantProps<typeof avatarVariants> {
  username: string;
  imageUrl: string;
  isLive?: boolean;
  showBadge?: boolean;
}
export const UserAvatar = ({ username, imageUrl, isLive, showBadge }: UserAvatarProps) => {
  const canShowBadge = isLive && showBadge;
  return (
    <div className='relative'>
      <Avatar className={cn(avatarVariants({ size: "default" }), isLive && "ring-2 ring-rose-500 border border-background")}>
      {imageUrl ? <AvatarImage src={imageUrl} className="object-cover" alt={username} /> : null}
      <AvatarFallback>{username[0]?.toUpperCase()}</AvatarFallback>
    </Avatar>
    {
      canShowBadge && (
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2">
          <LiveBadge />
        </div>
      )
    }
    

    </div>
    
  );
};

interface UserAvatarSkeletonProps extends VariantProps<typeof avatarVariants> {
  className?: string;
}
export const UserAvatarSkeleton = ({ size, className }: UserAvatarSkeletonProps) => {
  return (
    <div className='relative'>
      <Skeleton className={cn(avatarVariants({ size: "default" }), "rounded-full", className)} />
    </div>
  );
};