import { isFollowingUser } from "@/lib/follow-service";
import { getUserByUsername } from "@/lib/user-service";
import { notFound } from "next/navigation";
import { Actions } from "./_components/Actions";

interface UserPageProps {
  params: Promise<{
    username: string;
  }>
}
const UserPage = async ({ params }: UserPageProps) => {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) {
    return notFound();
  }
  const isFollowing = await isFollowingUser(user.id);
  return (
  <div className="flex flex-col items-center justify-center h-screen">
    <h1>{user.username}</h1>
    <p>{user.bio}</p>
    <p>{user.imageUrl}</p>
    <p>{isFollowing ? "Following" : "Not following"}</p>
    <Actions userId={user.id} isFollowing={isFollowing} />
  </div>);
};

export default UserPage;