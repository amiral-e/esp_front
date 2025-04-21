"use client"

import { type Response } from "@/actions/report"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ReportDetailProps {
  report: Response
}

export default function ReportDetail({ report }: ReportDetailProps) {
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
    <Card>
      <CardHeader>
        <CardTitle>{report.title}</CardTitle>
      </CardHeader>
      <CardContent className="prose max-w-none">{formatContent(report.text)}</CardContent>
    </Card>
  )
}
