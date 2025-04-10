import Link from "next/link";
import CreateReportForm from "../_components/create-report-form";
import { Button } from "@/components/ui/button";

export default function CreateReportPage() {
    return (
        <div className="container mx-auto py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold"> Créer un nouveau rapport</h1>
                <Link href="/protected/report">
                    <Button>Rapport liste</Button>
                </Link>
            </div>
            <CreateReportForm />
        </div>
    )
}