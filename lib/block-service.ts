import { db } from "@/prisma/db";
import { getSelf } from "@/lib/auth-service";

export const getBlocking = async () => {
  try {
    const self = await getSelf();
    const blocking = await db.orm.public.Block.where({
      blockerId: self.id,
    }).all();
    return blocking;
  } catch {
    return [];
  }
};

export const getBlockedBy = async () => {
  try {
    const self = await getSelf();
    const blockedBy = await db.orm.public.Block.where({
      blockedId: self.id,
    }).all();
    return blockedBy;
  } catch {
    return [];
  }
};

export const isBlockedByUser = async (userId: string) => {
  try {
    const self = await getSelf();

    const otherUser = await db.orm.public.User.where({
      id: userId,
    }).first();
    if (!otherUser) {
      throw new Error("User not found");
    }
    if (self.id === otherUser.id) {
      return false;
    }

    const existingBlock = await db.orm.public.Block.where({
      blockedId: self.id,
      blockerId: userId,
    }).first();
    return !!existingBlock;
  } catch {
    return false;
  }
};

export const blockUser = async (userId: string) => {
  try {
    const self = await getSelf();
    const otherUser = await db.orm.public.User.where({
      id: userId,
    }).first();
    if (!otherUser) {
      throw new Error("User not found");
    }
    if (self.id === otherUser.id) {
      throw new Error("You cannot block yourself");
    }

    const existingBlock = await db.orm.public.Block.where({
      blockerId: self.id,
      blockedId: userId,
    }).first();
    if (existingBlock) {
      throw new Error("You are already blocking this user");
    }

    const blockedUser = await db.orm.public.Block
    .include('blocked', (user) => user.select('id', 'username', 'imageUrl'))
    .create({
      blockerId: self.id,
      blockedId: userId,
    });
    return blockedUser;
  } catch {
    throw new Error("Failed to block user");
  }
};

export const unblockUser = async (userId: string) => {
  try {
    const self = await getSelf();
    const otherUser = await db.orm.public.User.where({
      id: userId,
    }).first();
    if (!otherUser) {
      throw new Error("User not found");
    }
    if (self.id === otherUser.id) {
      throw new Error("You cannot unblock yourself");
    }

    const existingBlock = await db.orm.public.Block.where({
      blockerId: self.id,
      blockedId: userId,
    }).first();
    if (!existingBlock) {
      throw new Error("You are not blocking this user");
    }

    const block = await db.orm.public.Block
    .include('blocked', (user) => user.select('id', 'username', 'imageUrl'))
    .include('blocker', (user) => user.select('id', 'username', 'imageUrl'))
    .where({
      blockerId: self.id,
      blockedId: userId,
    }).first();
    if (!block) {
      throw new Error("You are not blocking this user");
    }

    await db.orm.public.Block.where({ id: block.id }).delete();
    return block;
  } catch {
    throw new Error("Failed to unblock user");
  }
};

export const getBlockedUsers = async () => {
  try {
    const self = await getSelf();
    const blockedUsers = await db.orm.public.Block
    .include('blocked', (user) => user.select('id', 'username', 'imageUrl', 'createdAt'))
    .where({
      blockerId: self.id,
    }).all();
    return blockedUsers;
  } catch {
    return [];
  }
};