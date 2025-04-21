import { redirect } from "next/navigation"
import { isAdministrator } from "@/actions/admin"
import CollectionsPage from "../../collections/page"

export default async function AdminCollectionsPage() {
  const isAdmin = await isAdministrator()

  if (!isAdmin) {
    redirect("/collections")
  }

  return <CollectionsPage />
}
