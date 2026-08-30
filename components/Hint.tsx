"use client";

import { type ReactElement, type ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HintProps {
  children: ReactNode;
  label: string;
  asChild?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

export const Hint = ({ children, label, asChild, side, align }: HintProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          {...(asChild ? { render: children as ReactElement } : {})}
        >
          {asChild ? null : children}
        </TooltipTrigger>
        <TooltipContent className="text-black bg-white" side={side} align={align}>
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};