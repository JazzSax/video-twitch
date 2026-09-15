import { columns, type Community } from "./_components/Columns"
import { DataTable } from "./_components/DataTable"
import { getBlockedUsers } from "@/lib/block-service"
import { format } from 'date-fns'

const CommunityPage = async () => {
  const data = await getBlockedUsers()
  const formattedData: Community[] = data.map((block) => ({
    id: block.blocked.id,
    userId: block.blocked.id,
    username: block.blocked.username ?? "Unknown",
    imageUrl: block.blocked.imageUrl ?? "",
    createdAt: format(block.createdAt, "MM/dd/yyyy"),
  }))

  console.log(formattedData)

  return (
    <div className="p-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold">Community</h1>
      </div>
      <DataTable columns={columns} data={formattedData} />

    </div>
  );
};

export default CommunityPage;