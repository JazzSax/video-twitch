"use client";

import { useParticipants } from "@livekit/components-react";
import { useState, useMemo } from "react";
import { useDebounceValue } from "usehooks-ts";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommunityItem } from "./CommunityItem";
import { RemoteParticipant, LocalParticipant } from "livekit-client";
interface ChatCommunityProps {
  viewerName: string;
  hostName: string ;
  isHidden: boolean;
}
export const ChatCommunity = ({ viewerName, hostName, isHidden }: ChatCommunityProps) => {
  const [value, setValue] = useState("");
  const [debouncedValue] = useDebounceValue<string>(value, 500);
  const participants = useParticipants();

  const onChange = (newValue: string) => {
    setValue(newValue);
  }

  const filteredParticipants = useMemo(() => {
    const deduped = participants.reduce((acc, participant) => {
      const hostAsViewer = `host-${participant.identity}`;
      if(!acc.some((p) => p.identity === hostAsViewer)) {
        acc.push(participant);
      }
      return acc;
    }, [] as (RemoteParticipant | LocalParticipant)[]);
    return deduped.filter((participant) => {
      return participant.name?.toLowerCase().includes(debouncedValue.toLowerCase());
    })
  }, [participants, debouncedValue]);
  if (isHidden) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">
          Community chat is disabled
        </p>
      </div>
    )
  }

  return (
    <div className='p-4'>
      <Input
        placeholder="Search community"
        className='border-white/10'
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <ScrollArea className='gap-y-2 mt-4'>
        <p className="text-center text-sm text-muted-foreground hidden last:block p-2">
          No results found
        </p>
        {
        filteredParticipants.map((participant) => (
          <CommunityItem 
            key={participant.identity} 
            participantName={participant.name} 
            participantIdentity={participant.identity}
            hostName={hostName} 
            viewerName={viewerName} />
          
        ))
      }

      </ScrollArea>
    
    </div>
  );
};