"use server";

import { getSelf } from "@/lib/auth-service";
import { blockUser, unblockUser } from "@/lib/block-service";
import { revalidatePath } from "next/cache";
import { RoomServiceClient } from "livekit-server-sdk";

const roomService = new RoomServiceClient(
  process.env.LIVEKIT_API_URL!, 
  process.env.LIVEKIT_API_KEY!, 
  process.env.LIVEKIT_API_SECRET!)
export const onBlock = async (userId: string) => {
  const self = await getSelf();
  let blockedUser;
    

  try {
    blockedUser = await blockUser(userId);
  } catch {
    // This means the user is guest and not logged in

  }

  try{
    await roomService.removeParticipant(self.id, userId);
  } catch {
    // This means the user is not in the room

  }

  revalidatePath(`/u/${self.username}/community`);
  
  if (!blockedUser) {
    throw new Error("Failed to block user");
  }
  revalidatePath(`/${blockedUser.blocked.username}`);
  return blockedUser ;

  
};

export const onUnblock = async (userId: string) => {
  
  const unblockedUser = await unblockUser(userId);
  if (!unblockedUser) {
    throw new Error("Failed to unblock user");
  }
  revalidatePath(`/${unblockedUser.blocked.username}`);
  return unblockedUser;
 
};