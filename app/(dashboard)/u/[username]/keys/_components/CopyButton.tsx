"use client"

import { Button } from "@/components/ui/button";
import { CheckIcon, CopyIcon } from "lucide-react";
import { useState } from "react";
interface CopyButtonProps {
  value: string;
}
export const CopyButton = ({ value }: CopyButtonProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const onCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };
  const Icon = isCopied ? CheckIcon : CopyIcon;
  return (
    <Button variant="ghost" size="sm" onClick={onCopy} disabled={!value} >
      <Icon className="w-4 h-4" />
    </Button>
  );
};