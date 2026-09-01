"use client";

import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

interface ActionsProps {
  userId: string;
  isFollowing: boolean;
}

export const Actions = ({ userId, isFollowing }: ActionsProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleFollow = () => {
    startTransition(() => {
      void onFollow(userId)
        .then((data) => {
          toast.success(`Followed ${data.following.username ?? "user"}`);
          router.refresh();
        })
        .catch(() => {
          toast.error("Failed to follow user");
        });
    });
  };

  const handleUnfollow = () => {
    startTransition(() => {
      void onUnfollow(userId)
        .then((data) => {
          toast.success(`Unfollowed ${data.following.username ?? "user"}`);
          router.refresh();
        })
        .catch(() => {
          toast.error("Failed to unfollow user");
        });
      });
  };

  const onClick = isFollowing ? handleUnfollow : handleFollow;

  return (
    <Button disabled={isPending} variant="primary" onClick={onClick}>
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};
