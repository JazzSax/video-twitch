import { db } from "@/prisma/db";
import { getSelf } from "@/lib/auth-service";

export const getRecommended = async () => {
  // await new Promise(resolve => setTimeout(resolve, 10000));

  const users = await db.orm.public.User
    .orderBy((u) => u.createdAt.desc())
    .all();

  return users;
};
