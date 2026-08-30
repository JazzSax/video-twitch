import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/prisma/db";

export const getSelf = async () => {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    throw new Error("Unauthorized");
  }
  const user = await db.orm.public.User.where({
    clerkId: clerkUser.id,
  }).first();
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}