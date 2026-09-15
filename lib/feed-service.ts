import { db } from "@/prisma/db";
import { getSelf } from "@/lib/auth-service";

export const getStreams = async() => {
  let userId;
  try {
    const self = await getSelf();
    userId = self.id;
  } catch {
    // This means the user is guest and not logged in
    userId = null;
  }
  let streams = [];
  if(userId) {
    streams = await db.orm.public.Stream
      .select('id','isLive', 'name', 'thumbnail')
      .include('user', (user) => user.select('id', 'clerkId', 'username', 'bio', 'imageUrl', 'createdAt', 'updatedAt'))
      .where((s) => s.user.some((u) => u.blocking.none((b) => b.blockedId.eq(userId))))
      .orderBy((s) => s.updatedAt.desc())
      .all();
  } else {
    streams = await db.orm.public.Stream
      .select('id', 'isLive', 'name', 'thumbnail')
      .include('user', (user) => user.select('id', 'clerkId', 'username', 'bio', 'imageUrl', 'createdAt', 'updatedAt'))
      .orderBy((s) => s.updatedAt.desc())
      .all();
    
  }
  streams.sort((a, b) => Number(b.isLive) - Number(a.isLive));

  return streams;
};
