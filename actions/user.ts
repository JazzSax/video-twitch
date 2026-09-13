"use server";

import { db } from "@/prisma/db";
import type { FieldOutputTypes } from "@/prisma/schema";
import { getSelf } from "@/lib/auth-service";
import { revalidatePath } from "next/cache";
type User = FieldOutputTypes["public"]["User"];

export const updateUser = async(values: Partial<User>) => {
  try {
    const self = await getSelf();
    const validData = {
      bio: values.bio,
    }
    const user = await db.orm.public.User.where({
      id: self.id,
    }).update(validData);
    revalidatePath(`/u/${self.username}`);
    revalidatePath(`/${self.username}`);
    return user;
  }catch {
    throw new Error("Failed to update user");
  }
}