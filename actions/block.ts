"use server";

import { blockUser, unblockUser } from "@/lib/block-service";
import { revalidatePath } from "next/cache";

export const onBlock = async (userId: string) => {
  // TODO: Adapt to disconnect from livestream
  // TODO: allow ability to kick the guest
 
    const blockedUser = await blockUser(userId);
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