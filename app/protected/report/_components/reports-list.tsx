"use client"

import { type Report, deleteReport } from "@/actions/report"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "react-toastify"
import { Eye, FileText, Trash2 } from "lucide-react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import ReportViewModal from "./report-view-modal"

interface ReportsListProps {
  reports: Report[]
}

export default function ReportsList({ reports }: ReportsListProps) {
  const router = useRouter()
  const [selectedReportId, setSelectedReportId] = useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce rapport ?")) {
      {
        try {
          const response = await deleteReport(id)
          toast.success(response.message)
          router.refresh()
        } catch (error) {
          toast.error("Erreur lors de la suppression du rapport")
        }
      }
    }
  }

  const openReportModal = (id: number) => {
    setSelectedReportId(id)
    setIsModalOpen(true)
  }

  const closeReportModal = () => {
    setIsModalOpen(false)
    // Reset the selected report after the modal animation completes
    setTimeout(() => setSelectedReportId(null), 300)
  }

  if (reports.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium">Aucun rapport trouvé</h3>
        <p className="text-muted-foreground mt-2">Crée ton premier rapport pour commencer.</p>
      </div>
    )
  }

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reports.map((report) => (
          <Card key={report.id}>
            <CardHeader>
              <CardTitle className="truncate">{report.title}</CardTitle>
              <CardDescription>
                {report.created_at ? new Date(report.created_at).toISOString().split("T")[0] : "No date"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground line-clamp-3">
                {typeof report.text === "string" ? report.text.substring(0, 150) + "..." : "No content available"}
              </p>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => openReportModal(report.id)} className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View Report
              </Button>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(report.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <ReportViewModal reportId={selectedReportId} isOpen={isModalOpen} onClose={closeReportModal} />
    </>
  )
}
