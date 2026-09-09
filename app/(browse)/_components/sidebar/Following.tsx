"use client";
import { useSidebar } from "@/store/use-sidebar";
import type { FieldOutputTypes } from "@/prisma/schema.d";  
import { UserItem } from "./UserItem";
import { UserItemSkeleton } from "./UserItem";
type User = FieldOutputTypes["public"]["User"];
type Stream = FieldOutputTypes["public"]["Stream"];
type FollowingUser = Pick<User, "id" | "username" | "imageUrl"> & {
  stream: Pick<Stream, "isLive"> | null;
};
type Follow = FieldOutputTypes["public"]["Follow"];
interface FollowingProps {
  data: (Follow & { following: FollowingUser })[];
}
export const Following = ({ data }: FollowingProps) => {
  const { collapsed } = useSidebar();
  if (data.length === 0) {
    return null;
  }
  return (
    <div>
      {!collapsed && (
        <div className="pl-6 mb-4">
          <p className="text-sm text muted-forground">Following</p>
        </div>
      )}
      <ul className="space-y-2">
        {data.map((item) => (
          <li key={item.id}>
            <UserItem username={item.following.username} imageUrl={item.following.imageUrl} isLive={item.following.stream?.isLive ?? false} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export const FollowingSkeleton = () => {
  return (
    <ul className="px-2 pt-2 lg:pt-0">
      {Array.from({ length: 3 }).map((_, index) => (
        <UserItemSkeleton key={index} />
      ))}
    </ul>
  );
};