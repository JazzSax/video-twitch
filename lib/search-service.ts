import { db } from "@/prisma/db";
import { and, or } from "@prisma/orm-postgres/orm-client";
import { getSelf } from "@/lib/auth-service";

export const getSearch = async (term: string) => {
  let userId;
  try {
    const self = await getSelf();
    userId = self?.id;
  } catch (error) {
    console.error(error);
    userId = null;
  }

  if(userId){
    const streams = await db.orm.public.Stream
      .select('id', 'name', 'thumbnail', 'isLive', 'updatedAt')
      .include('user', (user) => user.select('id', 'username', 'imageUrl'))
      .where((s) =>
        and(
          s.user.some((u) => u.blocking.none((b) => b.blockedId.eq(userId))),
          or(
            s.name.ilike(`%${term}%`),
            s.user.some((u) => u.username.ilike(`%${term}%`)),
          ),
        ),
      )
      .orderBy((s) => s.updatedAt.desc())
      .limit(10)
      .all();

    return streams;
  }

  return await db.orm.public.Stream
    .select('id', 'name', 'thumbnail', 'isLive', 'updatedAt')
    .include('user', (user) => user.select('id', 'username', 'imageUrl'))
    .where((s) =>
      or(
        s.name.ilike(`%${term}%`),
        s.user.some((u) => u.username.ilike(`%${term}%`)),
      ),
    )
    .orderBy((s) => s.updatedAt.desc())
    .limit(10)
    .all();
};

export type SearchStream = Awaited<ReturnType<typeof getSearch>>[number];
