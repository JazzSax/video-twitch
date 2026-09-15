"use client";

import { Button } from "@/components/ui/button";

import { useTransition } from "react";
import { onUnblock } from "@/actions/block";
import { toast } from "sonner";
interface UnblockButtonProps {
  userId: string;
}

export const UnblockButton = ({ userId }: UnblockButtonProps) => {
  const [isPending, startTransition] = useTransition();
  const onClick =  () => {
    startTransition(() => {
      onUnblock(userId)
        .then(() => { toast.success("User unblocked")})
        .catch(() => { toast.error("Something went wrong")});
    });
  }
  return (
    <Button variant="link" size="sm" onClick={onClick} disabled={isPending} className="text-blue-500 w-full">
      Unblock
    </Button>
  )
}