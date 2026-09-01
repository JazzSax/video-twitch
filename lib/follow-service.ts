import { db } from "@/prisma/db";
import { getSelf } from "@/lib/auth-service";
import { getBlocking, getBlockedBy } from "./block-service";

export const getFollowers = async () => {
  try {
    const self = await getSelf();

    const followers = await db.orm.public.Follow
    .include('following', (user) => user.select('id', 'username', 'imageUrl'))
    .where({
      followingId: self.id,
    })
    .all();
    return followers;
  } catch{
   
    return [];
  }
};

export const getFollowing = async () => {
  try {
    const self = await getSelf();
    const [following, blocking, blockedBy] = await Promise.all([
      db.orm.public.Follow
        .include('following', (user) => user.select('id', 'username', 'imageUrl'))
        .where({ followerId: self.id })
        .all(),
      getBlocking(),
      getBlockedBy(),
    ]);

    const hiddenIds = new Set([
      ...blocking.map((block) => block.blockedId),
      ...blockedBy.map((block) => block.blockerId),
    ]);
    return following.filter((follow) => !hiddenIds.has(follow.followingId));
  } catch {
    return [];
  }
};

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