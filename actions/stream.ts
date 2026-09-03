"use server"

import { revalidatePath } from "next/cache";
import { db } from "@/prisma/db";
import { getSelf } from "@/lib/auth-service";
import type { FieldOutputTypes } from "@/prisma/schema";

type Stream = FieldOutputTypes["public"]["Stream"];

export const updateStream = async (values: Partial<Stream>) => {
  try {
    const self = await getSelf();
    const selfStream = await db.orm.public.Stream.where({
      userId: self.id,
    }).first();
    if (!selfStream) {
      throw new Error("Stream not found");
    }
    const validData = {
      name: values.name,
      isChatEnabled: values.isChatEnabled,
      isChatDelayed: values.isChatDelayed,
      isChatFollowersOnly: values.isChatFollowersOnly,
    }

    const stream = await db.orm.public.Stream
      .where({ id: selfStream.id })
      .update(validData);
    revalidatePath(`/u/${self.username}/chat`);
    revalidatePath(`/u/${self.username}`);
    revalidatePath(`/${self.username}`);

    return stream;
  } catch {

    throw new Error("Failed to update stream");
  }
}