import { isAdministrator } from "@/actions/admin";
import NavigationMenuBar from "@/components/navigationMenuBar";

export default async function NavigationMenuWrapper() {
  const isAdmin = await isAdministrator()
  return <NavigationMenuBar isAdmin={isAdmin} />
}
