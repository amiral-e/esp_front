import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ProfileLayout from "./layout";
import { AppSidebar } from "@/components/app-sidebar";

export default function ProfilePage() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <ProfileLayout />
      </SidebarInset>
    </SidebarProvider>
  );
}