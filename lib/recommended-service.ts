import { db } from "@/prisma/db";
import { getSelf } from "@/lib/auth-service";

export const getRecommended = async () => {

  const users = await db.orm.public.User
    .orderBy((u) => u.createdAt.desc())
    .all();

  return users;
};
