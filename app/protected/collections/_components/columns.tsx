"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { Collection } from "@/actions/collections"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash2, FolderOpen } from "lucide-react"
import { deleteCollection, deleteGlobalCollection } from "@/actions/collections"
import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export const columns: ColumnDef<Collection>[] = [
  {
    accessorKey: "name",
    header: "Collection Name",
  },
  {
    accessorKey: "user",
    header: "Owner",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const collection = row.original

      return <Actions collection={collection} />
    },
  },
]

function Actions({ collection }: { collection: Collection }) {
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  const handleDelete = async (isAdmin: boolean) => {
    try {
      setIsDeleting(true)
      console.log(isAdmin)
      if (isAdmin) {
        await deleteGlobalCollection(collection.name)
      } if(!isAdmin) {
        await deleteCollection(collection.name)
      }
      router.refresh()
    } catch (error) {
      console.error("Error deleting collection:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="flex justify-end">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem
                onSelect={(e) => e.preventDefault()}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Collection
              </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Voulez-vous vraiment supprimer cette collection?</AlertDialogTitle>
                <AlertDialogDescription>
                    Cette action est irréversible. Elle supprimera définitivement la collection ainsi que tous ses documents.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => {
                    const isAdmin = window.location.pathname.includes("/admin/")
                    handleDelete(isAdmin)
                  }}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
