import { headers } from "next/headers";
import { WebhookReceiver } from "livekit-server-sdk";
import { db } from "@/prisma/db";

const receiver = new WebhookReceiver(
  process.env.LIVEKIT_API_KEY!,
  process.env.LIVEKIT_API_SECRET!
);

export async function POST(request: Request) {
  const body = await request.text();
  const headersPayload = await headers();
  const authorization = headersPayload.get("Authorization");
 
  if (!authorization) {
    return new Response("Bad Request", { status: 400 });
  }
  const event = await receiver.receive(body, authorization);
  
  if(event.event === "ingress_started") {
    await db.orm.public.Stream.where({ ingressId: event.ingressInfo?.ingressId })
    .update({
      isLive: true,
    });
  }

  if(event.event === "ingress_ended") {
    await db.orm.public.Stream.where({ ingressId: event.ingressInfo?.ingressId })
    .update({
      isLive: false,
    });
  }

  // Browser (webcam) publishing: the host joins their own room with identity === room name
  const isHostParticipant =
    !!event.room?.name && event.participant?.identity === event.room.name;

  if(event.event === "participant_joined" && isHostParticipant) {
    await db.orm.public.Stream.where({ userId: event.room!.name })
    .update({
      isLive: true,
    });
  }

  if(event.event === "participant_left" && isHostParticipant) {
    await db.orm.public.Stream.where({ userId: event.room!.name })
    .update({
      isLive: false,
    });
  }
  return new Response("OK", { status: 200 });
}