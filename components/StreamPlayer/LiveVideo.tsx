"use client";

import { Participant, Track } from "livekit-client";
import { useEffect, useRef, useState } from "react";
import { useTracks } from "@livekit/components-react";
import { FullScreenControl } from "./FullScreenControl";
import { useEventListener } from "usehooks-ts";
import { VolumeControl } from "./VolumeControl";
interface LiveVideoProps {
  participant: Participant;
}

export const LiveVideo = ({ participant }: LiveVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const documentRef = useRef(document);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [volume, setVolume] = useState(0);
  const toggleFullScreen = () => {
    if (isFullScreen) {
      document.exitFullscreen();
    } else if (wrapperRef.current) {
      wrapperRef.current.requestFullscreen();
    }
  };

  const onVolumeChange = (volume: number) => {
    setVolume(volume);
    if (videoRef.current) {
      videoRef.current.muted = volume === 0;
      videoRef.current.volume = volume;
    }
  };

  const onVolumeToggle = () => {
    const isMuted = volume === 0;
    setVolume(isMuted ? 50 : 0);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      videoRef.current.volume = isMuted ? 0.5 : 0;
    }
  };

  useEffect(() => {
    onVolumeChange(0);
  }, []);

  const handleFullscreenChange = () => {
    setIsFullScreen(document.fullscreenElement !== null);
  };

  useEventListener("fullscreenchange", handleFullscreenChange, documentRef);

  const tracks = useTracks([Track.Source.Camera, Track.Source.Microphone]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    const matchedTracks = tracks.filter(
      (track) => track.participant.identity === participant.identity,
    );

    matchedTracks.forEach((track) => {
      track.publication?.track?.attach(el);
    });

    return () => {
      matchedTracks.forEach((track) => {
        track.publication?.track?.detach(el);
      });
    };
  }, [tracks, participant.identity]);

  return (
    <div className="relative flex h-full" ref={wrapperRef}>
      <video width="100%" ref={videoRef} />
      <div className="absolute top-0 h-full w-full opacity-0 hover:opacity-100 transition-opacity duration-300"> 
        <div className="absolute bottom-0 flex h-14 w-full items-center justify-between bg-gradient-to-r from-neutral-900 px-4">
          <VolumeControl volume={volume} onChange={onVolumeChange} onToggle={onVolumeToggle} />
          <FullScreenControl isFullScreen={isFullScreen} onToggle={toggleFullScreen} /> 
         

        </div>

      </div>
    </div>
  );
};
