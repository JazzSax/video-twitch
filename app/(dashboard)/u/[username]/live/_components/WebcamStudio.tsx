"use client"

import { useEffect, useRef, useState, useTransition } from "react";
import {
  createLocalTracks,
  LocalAudioTrack,
  LocalVideoTrack,
  Room,
  RoomEvent,
  Track,
  VideoPresets,
} from "livekit-client";
import { AlertTriangleIcon, Mic, MicOff, Radio, Square, Video, VideoOff } from "lucide-react";
import { toast } from "sonner";
import { createPublisherToken } from "@/actions/publish";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type DeviceItem = { value: string; label: string }

const toItems = (devices: MediaDeviceInfo[], fallback: string): DeviceItem[] =>
  devices
    .filter((device) => device.deviceId)
    .map((device, index) => ({ value: device.deviceId, label: device.label || `${fallback} ${index + 1}` }))

const describeMediaError = (error: unknown) => {
  const name = error instanceof DOMException ? error.name : ""
  if (name === "SecurityError") return "Your browser only allows camera access over HTTPS or on localhost."
  if (name === "NotAllowedError") return "Camera or microphone access was blocked. Allow access in your browser's site settings and reload."
  if (name === "NotFoundError") return "No camera or microphone was found. Plug one in and reload."
  if (name === "NotReadableError") return "Your camera or microphone is being used by another app. Close it and reload."
  return "Could not start your camera or microphone."
}

export const WebcamStudio = () => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const roomRef = useRef<Room | null>(null)
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack | null>(null)
  const [audioTrack, setAudioTrack] = useState<LocalAudioTrack | null>(null)
  const [cameras, setCameras] = useState<DeviceItem[]>([])
  const [mics, setMics] = useState<DeviceItem[]>([])
  const [cameraId, setCameraId] = useState<string>("")
  const [micId, setMicId] = useState<string>("")
  const [isLive, setIsLive] = useState(false)
  const [isCameraOff, setIsCameraOff] = useState(false)
  const [isMicMuted, setIsMicMuted] = useState(false)

  // Start the local preview once, and release the camera when leaving the page
  useEffect(() => {
    let cancelled = false
    let tracks: (LocalVideoTrack | LocalAudioTrack)[] = []

    const start = window.isSecureContext && navigator.mediaDevices
      ? createLocalTracks({ audio: true, video: { resolution: VideoPresets.h720.resolution } })
      : Promise.reject(new DOMException("Insecure context", "SecurityError"))

    start
      .then(async (created) => {
        if (cancelled) {
          created.forEach((track) => track.stop())
          return
        }
        tracks = created as (LocalVideoTrack | LocalAudioTrack)[]
        const video = tracks.find((track) => track.kind === Track.Kind.Video) as LocalVideoTrack | undefined
        const audio = tracks.find((track) => track.kind === Track.Kind.Audio) as LocalAudioTrack | undefined
        setVideoTrack(video ?? null)
        setAudioTrack(audio ?? null)

        const [videoDevices, audioDevices] = await Promise.all([
          Room.getLocalDevices("videoinput"),
          Room.getLocalDevices("audioinput"),
        ])
        if (cancelled) return
        setCameras(toItems(videoDevices, "Camera"))
        setMics(toItems(audioDevices, "Microphone"))
        setCameraId((await video?.getDeviceId()) ?? "")
        setMicId((await audio?.getDeviceId()) ?? "")
      })
      .catch((err) => {
        if (!cancelled) setError(describeMediaError(err))
      })

    const onBeforeUnload = () => {
      void roomRef.current?.disconnect()
    }
    window.addEventListener("beforeunload", onBeforeUnload)

    return () => {
      cancelled = true
      window.removeEventListener("beforeunload", onBeforeUnload)
      void roomRef.current?.disconnect()
      roomRef.current = null
      tracks.forEach((track) => track.stop())
    }
  }, [])

  useEffect(() => {
    const element = videoRef.current
    if (!videoTrack || !element) return
    videoTrack.attach(element)
    return () => {
      videoTrack.detach(element)
    }
  }, [videoTrack])

  const onCameraChange = async (deviceId: string) => {
    setCameraId(deviceId)
    await videoTrack?.restartTrack({ deviceId, resolution: VideoPresets.h720.resolution })
      .catch(() => toast.error("Could not switch camera"))
  }

  const onMicChange = async (deviceId: string) => {
    setMicId(deviceId)
    await audioTrack?.restartTrack({ deviceId })
      .catch(() => toast.error("Could not switch microphone"))
  }

  const toggleCamera = async () => {
    if (!videoTrack) return
    if (isCameraOff) await videoTrack.unmute()
    else await videoTrack.mute()
    setIsCameraOff(!isCameraOff)
  }

  const toggleMic = async () => {
    if (!audioTrack) return
    if (isMicMuted) await audioTrack.unmute()
    else await audioTrack.mute()
    setIsMicMuted(!isMicMuted)
  }

  const goLive = () => {
    if (!videoTrack || !audioTrack) return
    startTransition(async () => {
      // Keep the preview tracks alive when the room goes away
      const room = new Room({ adaptiveStream: false, dynacast: true, stopLocalTrackOnUnpublish: false })
      try {
        const token = await createPublisherToken()
        room.on(RoomEvent.Disconnected, () => {
          if (roomRef.current === room) roomRef.current = null
          setIsLive(false)
        })
        await room.connect(process.env.NEXT_PUBLIC_LIVEKIT_WS_URL!, token)
        roomRef.current = room
        await room.localParticipant.publishTrack(videoTrack, { simulcast: true, source: Track.Source.Camera })
        await room.localParticipant.publishTrack(audioTrack, { source: Track.Source.Microphone })
        setIsLive(true)
        toast.success("You're live!")
      } catch {
        await room.disconnect(false)
        toast.error("Failed to go live")
      }
    })
  }

  const endStream = () => {
    startTransition(async () => {
      await roomRef.current?.disconnect(false)
      roomRef.current = null
      setIsLive(false)
      toast.success("Stream ended")
    })
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-3xl">
        <AlertTriangleIcon className="w-4 h-4" />
        <AlertTitle>Camera unavailable</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black">
        <video ref={videoRef} muted playsInline className="h-full w-full object-cover -scale-x-100" />
        {!videoTrack && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">
            Starting camera...
          </div>
        )}
        {isCameraOff && (
          <div className="absolute inset-0 flex items-center justify-center bg-black text-sm text-muted-foreground">
            Camera is off
          </div>
        )}
        {isLive && (
          <span className="absolute top-3 left-3 rounded-md bg-rose-500 px-2 py-0.5 text-xs font-semibold uppercase text-white">
            Live
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select items={cameras} value={cameraId} onValueChange={(value) => onCameraChange(value as string)}>
          <SelectTrigger className="w-60" disabled={!videoTrack}>
            <SelectValue placeholder="Camera" />
          </SelectTrigger>
          <SelectContent>
            {cameras.map((camera) => (
              <SelectItem key={camera.value} value={camera.value}>{camera.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select items={mics} value={micId} onValueChange={(value) => onMicChange(value as string)}>
          <SelectTrigger className="w-60" disabled={!audioTrack}>
            <SelectValue placeholder="Microphone" />
          </SelectTrigger>
          <SelectContent>
            {mics.map((mic) => (
              <SelectItem key={mic.value} value={mic.value}>{mic.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={toggleCamera} disabled={!videoTrack} aria-label={isCameraOff ? "Turn camera on" : "Turn camera off"}>
          {isCameraOff ? <VideoOff /> : <Video />}
        </Button>
        <Button variant="outline" size="icon" onClick={toggleMic} disabled={!audioTrack} aria-label={isMicMuted ? "Unmute microphone" : "Mute microphone"}>
          {isMicMuted ? <MicOff /> : <Mic />}
        </Button>
        <div className="ml-auto">
          {isLive ? (
            <Button variant="destructive" onClick={endStream} disabled={isPending}>
              <Square /> End stream
            </Button>
          ) : (
            <Button variant="primary" onClick={goLive} disabled={isPending || !videoTrack || !audioTrack}>
              <Radio /> {isPending ? "Connecting..." : "Go Live"}
            </Button>
          )}
        </div>
      </div>

      <Alert>
        <AlertTriangleIcon className="w-4 h-4" />
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          Keep this tab open while you&apos;re live. Going live here will disconnect OBS if it&apos;s currently streaming.
        </AlertDescription>
      </Alert>
    </div>
  );
};
