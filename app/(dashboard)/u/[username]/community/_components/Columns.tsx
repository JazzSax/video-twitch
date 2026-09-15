"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import { type DataTableFeatures } from "@/lib/data-table"
import { UserAvatar } from "@/components/UserAvatar"
import { ArrowUpDown } from "lucide-react"
import { UnblockButton } from "./UnblockButton"
export type Community = {
  id: string
  userId: string
  username: string
  imageUrl: string
  createdAt: string
}


const columnHelper = createColumnHelper<DataTableFeatures, Community>()

export const columns = columnHelper.columns([
 
  columnHelper.accessor("username", {
      header: ({ column }) =>  {
        return (
          <Button variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Username
            <ArrowUpDown className="w-4 h-4 ml-2" />
          </Button>
          )
        },
      cell: ({ row }) => (
      <div className="flex items-center gap-x-4">
        <UserAvatar 
          username={row.original.username}
          imageUrl={row.original.imageUrl}
        />
        <span className="text-sm font-medium">{row.original.username}</span>
      </div>
    )
  }),
 
  columnHelper.accessor("createdAt", {
    header: ({ column }) =>  {
      return (
      <Button variant="ghost"
       onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Date blocked
        <ArrowUpDown className="w-4 h-4 ml-2" />
      </Button>
      )
    },
  }),

  columnHelper.display({
    id: "actions",
    cell: ({ row }) => <UnblockButton userId={row.original.id} />,
  }),
])