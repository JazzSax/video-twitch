"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { MinusCircle } from "lucide-react";
import { Hint } from "@/components/Hint";
import { onBlock } from "@/actions/block";
import { cn, stringToColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CommunityItemProps {
  participantName?: string;
  participantIdentity: string;
  hostIdentity: string;
  viewerIdentity: string;
}

export const CommunityItem = ({
  participantName,
  participantIdentity,
  hostIdentity,
  viewerIdentity,
}: CommunityItemProps) => {
  const color = stringToColor(participantName ?? "");
  const [isPending, startTransition] = useTransition();

  const hostAsViewer = `host-${hostIdentity}`;
  // Am *I* the stream host?
  const isHost = viewerIdentity === hostAsViewer;
  const isSelf = participantIdentity === viewerIdentity;
  const isParticipantHost =
    participantIdentity === hostIdentity ||
    participantIdentity === hostAsViewer;

  const handleBlock = () => {
    if (!participantName || isSelf || isParticipantHost) return;
    startTransition(() => {
      onBlock(participantIdentity)
        .then(() => toast.success(`Blocked ${participantName}`))
        .catch(() => toast.error(`Something went wrong`));
    });
  };

  return (
    <div
      className={cn(
        "group flex w-full items-center justify-between rounded-md p-2 text-sm hover:bg-white/5",
      )}
    >
      <p style={{ color }}>{participantName}</p>
      {isHost && !isSelf && !isParticipantHost && (
        <Hint label="Block" asChild>
          <Button
            variant="ghost"
            disabled={isPending}
            onClick={handleBlock}
            className="h-auto w-auto p-1 opacity-0 transition group-hover:opacity-100"
          >
            <MinusCircle className="h-4 w-4 text-muted-foreground" />
          </Button>
        </Hint>
      )}
    </div>
  );
};
