"use client"

import { getReportById } from "@/actions/report"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

interface ReportViewModalProps {
    reportId: number | null
    isOpen: boolean
    onClose: () => void
}

export default function ReportViewModal({ reportId, isOpen, onClose }: ReportViewModalProps) {
    const [report, setReport] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        async function loadReport() {
            if (reportId && isOpen) {
                setLoading(true)
                try {
                    const reportData = await getReportById(reportId)
                    setReport(reportData)
                } catch (error) {
                    toast.error("Erreur lors du chargement du rapport")
                    onClose()
                } finally {
                    setLoading(false)
                }
            }
        }

        loadReport()
    }, [reportId, isOpen, toast, onClose])

    // Format the text content for display
    const formatContent = (text: any) => {
        if (typeof text === "string") {
            // Split by paragraphs and render
            return text.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                    {paragraph}
                </p>
            ))
        }

        // If it's an object or other format, stringify it
        return <pre>{JSON.stringify(text, null, 2)}</pre>
    }

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogTitle className="text-2xl"></DialogTitle>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                ) : report ? (
                    <>
                        <DialogHeader>
                            <DialogTitle className="text-2xl">{report.title}</DialogTitle>
                            <DialogDescription>
                                {report.created_at ? new Date(report.created_at).toISOString().split("T")[0] : ""}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-6 prose max-w-none dark:prose-invert">{formatContent(report.text)}</div>
                        <div className="mt-6 flex justify-end">
                            <Button variant="outline" onClick={onClose}>
                                Close
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="text-center py-8">
                        <p>Report not found</p>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}
