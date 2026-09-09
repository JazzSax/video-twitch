"use client";
import type { FieldOutputTypes } from "@/prisma/schema.d";
import { useSidebar } from "@/store/use-sidebar";
import { UserItem } from "./UserItem";

import { UserItemSkeleton } from "./UserItem";
type User = FieldOutputTypes["public"]["User"];
type Stream = FieldOutputTypes["public"]["Stream"];

interface RecommendedProps {
  users: (User & { stream: Pick<Stream, "isLive"> | null })[];
}

export const Recommended = ({ users }: RecommendedProps) => {
  const { collapsed } = useSidebar();
  const showLabel = !collapsed && users.length > 0;
  return (
    <div>
      {
        showLabel && (
          <div className="pl-6 mb-4">
            <h2 className="text-sm text-muted-foreground">Recommended</h2>
          </div>
        )
      }
      <ul className="space-y-2 px-2">
        {users.map((user) => (
          <UserItem key={user.id} username={user.username} imageUrl={user.imageUrl} isLive={user.stream?.isLive ?? false} />
        ))}
      </ul>
    </div>
  );
};

export const RecommendedSkeleton = () => {
  return (
    <ul className="space-y-2 px-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <UserItemSkeleton key={index} />
      ))}
    </ul>
  );
};