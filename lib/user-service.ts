import { db } from "@/prisma/db";

export const getUserByUsername = async (username: string) => {
  try {
    const user = await db.orm.public.User.where({
      username: username,
    }).first();
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};