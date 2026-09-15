import { db } from "@/prisma/db";

export const getUserByUsername = async (username: string) => {
  try {
    const user = await db.orm.public.User
      .select('id', 'clerkId', 'username', 'imageUrl', 'bio')
      .include('stream', (stream) => stream.select('id', 'isLive', 'isChatEnabled', 'isChatDelayed', 'isChatFollowersOnly', 'name', 'thumbnail'))
      .include('followers', (followers) => followers.count())
      .where({
        username: username,
      }).first();
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export type UserByUsername = NonNullable<Awaited<ReturnType<typeof getUserByUsername>>>;
export type UserStream = NonNullable<UserByUsername["stream"]>;

export const getUserById = async (id: string) => {
  try {
    const user = await db.orm.public.User
      .include('stream', (stream) => stream.select('id', 'streamKey', 'serverUrl', 'ingressId', 'isLive', 'isChatEnabled', 'isChatDelayed', 'isChatFollowersOnly', 'name', 'thumbnail'))
      .include('followers', (followers) => followers.count())
      .where({
        id: id,
      }).first();
    return user;
  } catch (error) {
    console.error(error);
    return null;
  }
};
