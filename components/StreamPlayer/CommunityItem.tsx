"use client";

import { toast } from "sonner";
import { useTransition  } from "react";
import { MinusCircle } from "lucide-react";
import { Hint } from "@/components/Hint";
import { onBlock } from "@/actions/block";
import { cn, stringToColor } from "@/lib/utils";
import { Button } from "@/components/ui/button";


interface CommunityItemProps {
  participantName?: string;
  participantIdentity: string;
  hostName: string;
  viewerName: string;
}
export const CommunityItem = ({ participantName, participantIdentity, hostName, viewerName }: CommunityItemProps) => {
  const color = stringToColor(participantName ?? '');
  const [isPending, startTransition] = useTransition();
  const isSelf = participantIdentity === viewerName;
  const isHost = participantIdentity === hostName;

  const handleBlock = () =>  {
    if(!participantName || isSelf || isHost) return;
    startTransition(() => {
      onBlock(participantIdentity)
      .then(() => toast.success(`Blocked ${participantName}`))
      .catch(() => toast.error(`Something went wrong`))
    });
  }

  return (
    <div className={cn('group flex items-center justify-between w-full p-2 rounded-md text-sm hover:bg-white/5')}>
      <p style={{ color }}>{participantName}</p>
      {
        isHost && !isSelf && (
          <Hint label="Block">
            <Button 
            variant="ghost"
            disabled={isPending} 
            onClick={handleBlock} 
            className='h-auto w-auto p-1 opacity-0 group-hover:opacity-100 transition'>
              <MinusCircle className='w-4 h-4 text-muted-foreground' />
            </Button>
          </Hint>
        )
      }
    </div>
  );
};