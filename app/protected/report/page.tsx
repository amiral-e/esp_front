import { Button } from "@/components/ui/button"
import Link from "next/link"
import ReportsList from "./_components/reports-list"
import { getReports } from "@/actions/report"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export default async function ReportsPage() {
    const reports = await getReports()

    return (
        <SidebarProvider>
            <SidebarInset>

                <div className="container mx-auto py-8">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold">Gestion des rapports</h1>
                        <Link href="/protected/report/create">
                            <Button>Créer un nouveau rapport</Button>
                        </Link>
                    </div>
                    <ReportsList reports={reports} />
                </div>
            </SidebarInset>
        </SidebarProvider>
    )
}