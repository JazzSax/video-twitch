"use server";

import { AccessToken, TrackSource } from "livekit-server-sdk";
import { getSelf } from "@/lib/auth-service";

export const createPublisherToken = async () => {
  const self = await getSelf();

  // Same identity as the ingress participant so viewers treat the browser as the host
  const token = new AccessToken(process.env.LIVEKIT_API_KEY!, process.env.LIVEKIT_API_SECRET!, {
    identity: self.id,
    name: self.username ?? undefined,
  });

  token.addGrant({
    room: self.id,
    roomJoin: true,
    canPublish: true,
    canPublishSources: [TrackSource.CAMERA, TrackSource.MICROPHONE],
    canSubscribe: false,
    canPublishData: false,
  });
  return await token.toJwt();
}
