"use client";

import type { FieldOutputTypes } from "@/prisma/schema.d";
import { useViewerToken } from "@/hooks/use-viewer-token";
import { LiveKitRoom } from "@livekit/components-react";
import { Video } from "./Video";
type User = FieldOutputTypes["public"]["User"];
type Stream = FieldOutputTypes["public"]["Stream"];
type StreamPreview = Pick<Stream, "id" | "streamKey" | "serverUrl" | "ingressId" | "isLive">;

interface StreamPlayerProps {
  user: User & { stream: StreamPreview | null };
  stream: StreamPreview;
  isFollowing: boolean;
}
export const StreamPlayer = ({ user, stream, isFollowing }: StreamPlayerProps) => {
  const { token, name, identity } = useViewerToken(user.id);
 
  if (!token || !name || !identity) {
    return <div>Cannot watch the stream</div>;
  }
  return (
    <>
      <LiveKitRoom
        token={token}
        serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_WS_URL!}
        className='grid grild-cols-1 lg:gap-y-0 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-6 h-full'
        
      >
        <div className='space-y-4 col-span-1 lg:col-span-2 xl:col-span-2 2xl:col-span-5 lg:overflow-y-auto hidden-scrollbar pb-10'>
          <Video hostName={user.username ?? ""} hostIdentity={user.id} />
        </div>
      </LiveKitRoom>
    </>
  );
};