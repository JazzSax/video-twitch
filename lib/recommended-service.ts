import { db } from "@/prisma/db";
import { getSelf } from "@/lib/auth-service";

export const getRecommended = async () => {
  // await new Promise(resolve => setTimeout(resolve, 10000));
  let userId;
  try {
    const self = await getSelf();
    userId = self?.id;
  } catch {
    userId = null;
  }

  if (userId) {
    const users = await db.orm.public.User
      .where((u) => u.id.neq(userId))
      .where((u) => u.followers.none((f) => f.followerId.eq(userId)))
      .orderBy((u) => u.createdAt.desc())
      .all();
    return users;
  }
  else {
    const users = await db.orm.public.User
      .orderBy((u) => u.createdAt.desc())
      .all();
    return users;
  }
};
