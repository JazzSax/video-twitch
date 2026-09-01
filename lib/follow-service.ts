import { db } from "@/prisma/db";
import { getSelf } from "@/lib/auth-service";

export const isFollowingUser = async (userId: string) => {
  try {
    const self = await getSelf();
    const otherUser = await db.orm.public.User.where({
      id: userId,
    }).first();
    if (!otherUser) {
      throw new Error("User not found");
    }
    if (self.id === otherUser.id) {
      return true;
    }
    const existingFollow = await db.orm.public.Follow.where({
      followerId: self.id,
      followingId: otherUser.id,
      }).first();
      return !!existingFollow;
  } catch (error) {
      console.error(error);
      return false;
  }
};

export const followUser = async (userId: string) => {
  try {
    const self = await getSelf();
    const otherUser = await db.orm.public.User.where({
      id: userId,
    }).first();
    if (!otherUser) {
      throw new Error("User not found");
    }
    if (self.id === otherUser.id) {
      throw new Error("You cannot follow yourself");
    }

    const existingFollow = await db.orm.public.Follow.where({
      followerId: self.id,
      followingId: otherUser.id,
    }).first();
    if (existingFollow) {
      throw new Error("You are already following this user");
    }

    const follow = await db.orm.public.Follow
    .include('follower', (user) => user.select('id', 'username', 'imageUrl'))
    .include('following', (user) => user.select('id', 'username', 'imageUrl'))
    .create({
      followerId: self.id,
      followingId: otherUser.id,
    });
    return follow;
  } catch (error) {
    console.error("followUser failed:", error);
    return null;
  }
};

export const unfollowUser = async (userId: string) => {
  try {
    const self = await getSelf();
    const otherUser = await db.orm.public.User.where({
      id: userId,
    }).first();
    if (!otherUser) {
      throw new Error("User not found");
    }
    if (self.id === otherUser.id) {
      throw new Error("You cannot unfollow yourself");
    }
    const follow = await db.orm.public.Follow
      .include("follower", (user) => user.select("id", "username", "imageUrl"))
      .include("following", (user) => user.select("id", "username", "imageUrl"))
      .where({
        followerId: self.id,
        followingId: otherUser.id,
      })
      .first();
    if (!follow) {
      throw new Error("You are not following this user");
    }

    await db.orm.public.Follow.where({ id: follow.id }).delete();
    return follow;
  } catch (error) {
    console.error("unfollowUser failed:", error);
    return null;
  }
};