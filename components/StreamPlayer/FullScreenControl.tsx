import { Maximize, Minimize } from "lucide-react";

import { Hint} from "@/components/Hint";

interface FullScreenControlProps{
  isFullScreen: boolean;
  onToggle: () => void;
}
export const FullScreenControl = ({ isFullScreen, onToggle }: FullScreenControlProps) => {
  const Icon = isFullScreen ? Minimize : Maximize;
  const label = isFullScreen ? "Exit fullscreen" : "Enter fullscreen";
  return (
    <div className="flex items-center justify-center gap-4">
      <Hint label={label} asChild>
        <button onClick={onToggle} className="text-white hover:bg-white/10 rounded-lg">
          <Icon className="w-5 h-5" />
        </button>
      </Hint>
    </div>
  );
};