"use server";

import { followUser, unfollowUser } from "@/lib/follow-service";
import { revalidatePath } from "next/cache";

export const onFollow = async (userId: string) => {
  const followedUser = await followUser(userId);
  if (!followedUser) {
    throw new Error("Failed to follow user");
  }

  if (followedUser.following.username) {
    revalidatePath(`/${followedUser.following.username}`);
  }

  return followedUser;
};

export const onUnfollow = async (userId: string) => {
  const unfollowedUser = await unfollowUser(userId);
  if (!unfollowedUser) {
    throw new Error("Failed to unfollow user");
  }
  return unfollowedUser;
};