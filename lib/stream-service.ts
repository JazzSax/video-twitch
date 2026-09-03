import { db } from "@/prisma/db";

export const getStreamByUserId = async (userId: string) => {
  const stream = await db.orm.public.Stream.where((s) => s.userId.eq(userId)).first();
  return stream;
};