import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { DataTable } from "./_components/data-table"
import { columns } from "./_components/columns"
import ModalCollection from "./_components/modal-collection"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import { getUserInfo } from "@/actions/oauth"
import { getCollections, getGlobalCollection } from "@/actions/collections"
import { isAdministrator } from "@/actions/admin"
import { ToastContainer } from "react-toastify"

export default async function CollectionsPage() {
  const user = await getUserInfo()
  const isAdmin = await isAdministrator()

  // Get collections based on user role
  const collections = isAdmin ? await getGlobalCollection() : await getCollections()

  return (
    <SidebarProvider>
      <SidebarInset>
        <div className="flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">{isAdmin ? "Admin Collections" : "My Collections"}</h1>
          <ModalCollection userId={user?.id || ""} isAdmin={isAdmin}>
            <Button className="w-fit flex items-center gap-2" id="add-collection-button">
              <PlusIcon className="h-4 w-4" />
              Add Collection
            </Button>
          </ModalCollection>
        </div>
        <ToastContainer></ToastContainer>
        <Separator />
        <div className="flex flex-1 flex-col gap-4 p-4">
          <DataTable columns={columns} data={collections || []} isAdmin={isAdmin} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}