import { getUserByUsername } from "@/lib/user-service";
import { notFound } from "next/navigation";
import { isFollowingUser } from "@/lib/follow-service";
import { isBlockedByUser } from "@/lib/block-service";
import { StreamPlayer } from "@/components/StreamPlayer";

interface UserPageProps {
  params: Promise<{
    username: string;
  }>;
}

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  
  if (!user || !user.stream) {
    notFound();
  }

  const isFollowing = await isFollowingUser(user.id);
  const isBlocked = await isBlockedByUser(user.id);

  if (isBlocked) {
    notFound();
  }

  return (
    <StreamPlayer
      key={user.id}
      user={user}
      stream={user.stream}
      isFollowing={isFollowing}
    />
  );
}
