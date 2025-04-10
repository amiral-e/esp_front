import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Report Not Found</h2>
      <p className="text-muted-foreground mt-2 mb-6">
        The report you're looking for doesn't exist or has been removed.
      </p>
      <Link href="/reports">
        <Button>Back to Reports</Button>
      </Link>
    </div>
  )
}