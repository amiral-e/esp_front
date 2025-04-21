import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import ProfileLayout from "./_components/layout";
import { ToastContainer } from "react-toastify";

export default function ProfilePage() {
  return (
    <SidebarProvider>
      <SidebarInset>
        <ToastContainer />
        <ProfileLayout />
      </SidebarInset>
    </SidebarProvider>
  );
}