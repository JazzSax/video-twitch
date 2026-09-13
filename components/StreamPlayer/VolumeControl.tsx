"use client";
import { Volume1, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Hint } from "@/components/Hint";

interface VolumeControlProps {
  volume: number;
  onChange: (volume: number) => void;
  onToggle: () => void;

}
export const VolumeControl = ({ volume, onChange, onToggle }: VolumeControlProps) => {
  const isMuted = volume === 0;
  const isAboveHalf = volume > 50;
  let Icon = Volume1;
  if(isMuted){
    Icon = VolumeX;
  } else if(isAboveHalf){
    Icon = Volume2;
  }
 
  const label = isMuted ? "Unmute" : "Mute" ;
  const handleChange = (value: number | readonly number[]) => {
    onChange(Array.isArray(value) ? value[0]! : value);
  };
  return (
    <div className="flex items-center gap-2">
      <Hint label={label} side="bottom" asChild>
        <button onClick={onToggle} className="text-white hover:bg-white/10 p-1.5 rounded-lg">
          <Icon className="w-6 h-6" />
        </button>
      </Hint>
      <Slider
        value={[volume]}
        max={100}
        step={1}
        onValueChange={handleChange}
        className="w-32 cursor-pointer"
      />
    </div>
  );
};