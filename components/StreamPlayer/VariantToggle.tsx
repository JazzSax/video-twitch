"use client";

import { Users, MessageSquare } from "lucide-react";
import { Hint } from '@/components/Hint';
import { Button } from "@/components/ui/button";
import { useChatSidebar, ChatVariant } from "@/store/use-chat-sidebar";


export const VariantToggle = () => {
  const { variant, onChangeVariant } = useChatSidebar();
  const isChat = variant === ChatVariant.CHAT;
  const Icon = isChat ? Users : MessageSquare;
  const onToggle = () => {
    const newVariant = isChat ? ChatVariant.COMMUNITY : ChatVariant.CHAT;
    onChangeVariant(newVariant);
  };

  const label = isChat ? "Community" : "Go back to a chat";

  return (
    <Hint label={label} side="left" asChild>
      <Button onClick={onToggle} variant="ghost" size="icon" className="h-auto p-2 hover:bg-white/10 hover:text-primary bg-transparent">
        <Icon className="w-4 h-4" />
      </Button>
    </Hint>
  );
};