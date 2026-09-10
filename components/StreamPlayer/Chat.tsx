"use client";

import { useChatSidebar } from "@/store/use-chat-sidebar";
import { useMediaQuery } from "usehooks-ts";
import { useChat, useConnectionState, useRemoteParticipant } from "@livekit/components-react";
import { ConnectionState } from "livekit-client";
import { useEffect, useMemo, useState } from "react";
import { ChatHeader } from "./ChatHeader";
import { ChatVariant } from "@/store/use-chat-sidebar";
import { ChatForm } from "./ChatForm";
import { ChatList } from "./ChatList";
import { ChatCommunity } from "./ChatCommunity";
interface ChatProps {
  viewerName: string;
  hostName: string ;
  hostIdentity: string;
  isFollowing: boolean;
  isChatEnabled: boolean;
  isChatDelayed: boolean;
  isChatFollowersOnly: boolean;
}
export const Chat = ({ viewerName, hostName, hostIdentity, isFollowing, isChatEnabled, isChatDelayed, isChatFollowersOnly }: ChatProps) => {  
  const matches = useMediaQuery('(max-width: 1024px)');
  const { variant, onExpand } = useChatSidebar();
  const connectionState = useConnectionState();
  const participant = useRemoteParticipant(hostIdentity);

  const isOnline = participant && connectionState === ConnectionState.Connected;
  const isHidden = !isChatEnabled || !isOnline;

  const [value, setValue] = useState("");
  const { chatMessages:messages, send } = useChat()

  useEffect(() => {
    if(matches) {
      onExpand();
    }
  }, [matches]);

  const reversedMessages = useMemo(() => {
    return [...messages].reverse();
  }, [messages]);

  const onSubmit = () => {
    if(!send) return;

    send(value);
    setValue("");
  }

  const onChange = (value: string) => {
    setValue(value);
  }
  return (
  <div className="flex flex-col bg-background border-l border-b pt-0 h-[calc(100vh-80px)]">
    <ChatHeader/>
    {
      variant === ChatVariant.CHAT && (
        <>
        <ChatList messages={reversedMessages} isHidden={isHidden}/>
        <ChatForm 
          onSubmit={onSubmit}
          onChange={onChange}
          value={value}
          isHidden={isHidden}
          isFollowersOnly={isChatFollowersOnly}
          isDelayed={isChatDelayed}
          isFollowing={isFollowing}
        />
        </>
       
      )
    }
    {
      variant === ChatVariant.COMMUNITY && (
        <ChatCommunity viewerName={viewerName} hostName={hostName} isHidden={isHidden}/>

      )
    }
  </div>
  );

};