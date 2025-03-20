import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import ModalCollection from "./_components/modal-collection";
import { Button } from "@/components/ui/button";
import { PlusIcon } from 'lucide-react';
import { getUserInfo } from "@/app/actions";
import { getCollectionByUserId } from "@/actions/collections";

export default async function CollectionsPage() {
  const user = await getUserInfo();
  const collections = await getCollectionByUserId(user?.id || "");
  
  return (
    <SidebarProvider>
      {/* <AppSidebar /> */}
      <SidebarInset>
        <h1 className="text-2xl font-bold p-4">Collections</h1>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <ModalCollection userId={user?.id || ""}>
            <Button variant="outline" className="w-fit flex items-center gap-2">
              <PlusIcon className="h-4 w-4" />
              Ajouter une collection
            </Button>
          </ModalCollection>
          <DataTable columns={columns} data={collections || []} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}