interface UserPageProps {
  params: Promise<{
    username: string;
  }>
}
const UserPage = async ({ params }: UserPageProps) => {
  const { username } = await params;
  return <div>UserPage {username}</div>;
};

export default UserPage;