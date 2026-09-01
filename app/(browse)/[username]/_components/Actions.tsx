"use client";

import { onFollow, onUnfollow } from "@/actions/follow";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { onBlock, onUnblock } from "@/actions/block";

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

  const handleBlock = () => {
    startTransition(() => {
      void onBlock(userId)
        .then((data) => {
          toast.success(`Blocked ${data.blocked.username ?? "user"}`);
          router.refresh();
        })
      });
  };

  const handleUnblock = () => {
    startTransition(() => {
      void onUnblock(userId)
        .then((data) => {
          toast.success(`Unblocked ${data.blocked.username ?? "user"}`);
          router.refresh();
        })
      });
  };



  return (
    <>
      <Button disabled={isPending} variant="primary" onClick={isFollowing ? handleUnfollow : handleFollow}>
        {isFollowing ? "Unfollow" : "Follow"}
      </Button>
      <Button disabled={isPending} variant="primary" onClick={handleBlock}>
        Block
      </Button>
      <Button disabled={isPending} variant="primary" onClick={handleUnblock}>Unblock</Button>
    </>
  );
};
