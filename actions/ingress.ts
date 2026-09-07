"use server"

import { IngressAudioEncodingPreset, IngressInput, IngressClient, IngressVideoOptions, IngressVideoEncodingPreset, RoomServiceClient, TrackSource, CreateIngressOptions, IngressAudioOptions} from "livekit-server-sdk"
import { db } from "@/prisma/db"
import { getSelf } from "@/lib/auth-service"
import { revalidatePath } from "next/cache"

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!, 
  process.env.LIVEKIT_API_KEY!, 
  process.env.LIVEKIT_API_SECRET!)

const ingressClient = new IngressClient(process.env.LIVEKIT_API_URL!)

export const resetIngress = async (hostIdentity: string) => {
  const ingresses = await ingressClient.listIngress({
    roomName: hostIdentity
  })
  const rooms = await roomService.listRooms([hostIdentity])

  for (const room of rooms) {
    await roomService.deleteRoom(room.name)
  }

  for (const ingress of ingresses) {
    if(ingress.ingressId) {
      await ingressClient.deleteIngress(ingress.ingressId)
    }
  }

}

export const createIngress = async (ingressType: IngressInput) => {
  const self = await getSelf()
  if (!self) {
    throw new Error("Unauthorized")
  }
  if (!self.username) {
    throw new Error("Username is required")
  }
  //Reset previous ingress
  await resetIngress(self.id)

  const options: CreateIngressOptions = {
    name: self.username,
    roomName: self.id,
    participantName: self.username,
    participantIdentity: self.id
  }

  if (ingressType === IngressInput.WHIP_INPUT) {
    options.enableTranscoding = false
  } else  {
    options.video = new IngressVideoOptions({
      source: TrackSource.CAMERA,
      encodingOptions: {
        case: "preset",
        value: IngressVideoEncodingPreset.H264_1080P_30FPS_3_LAYERS,
      },
    })
    options.audio = new IngressAudioOptions({
      source: TrackSource.MICROPHONE,
      encodingOptions: {
        case: "preset",
        value: IngressAudioEncodingPreset.OPUS_STEREO_96KBPS,
      },
    })
  }
  const ingress = await ingressClient.createIngress(ingressType, options)
  if (!ingress || !ingress.ingressId || !ingress.url) {
    throw new Error("Failed to create ingress")
  }
  await db.orm.public.Stream
  .where({ userId: self.id })
  .update({
    ingressId: ingress.ingressId,
    serverUrl: ingress.url,
    streamKey: ingress.streamKey,
  })

  revalidatePath(`/u/${self.username}/keys`)

  // IngressInfo is a protobuf class — Server Actions can only return plain objects
  return {
    ingressId: ingress.ingressId,
    url: ingress.url,
    streamKey: ingress.streamKey,
  }
}