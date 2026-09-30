"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useState } from "react";

// Mock ad for demo purposes only — no ad network involved.
const AD_IMAGE = "/ads/demo-ad.svg";
const AD_SIZE: [number, number] = [300, 100];

export const ChatAd = () => {
  const [isClosed, setIsClosed] = useState(false);

  if (isClosed) return null;

  return (
    <div className="flex justify-center border-b py-2">
      <div
        className="relative overflow-hidden rounded-md shadow-sm"
        style={{ width: AD_SIZE[0], height: AD_SIZE[1] }}
      >
        <Image
          src={AD_IMAGE}
          alt="NovaGear gaming headset ad"
          width={AD_SIZE[0]}
          height={AD_SIZE[1]}
          unoptimized
          className="h-full w-full object-cover"
        />
        <span className="absolute left-1 top-1 rounded-sm bg-yellow-400 px-1 text-[10px] font-bold leading-4 text-black">
          Ad
        </span>
        <button
          type="button"
          onClick={() => setIsClosed(true)}
          aria-label="Close ad"
          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white transition hover:bg-black/80"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};
