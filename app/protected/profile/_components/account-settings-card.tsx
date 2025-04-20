import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DeleteAccountDialog } from "./delete-account-dialog"
import { AlertCircle } from "lucide-react"

export function AccountSettingsCard() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-5 w-5" />
                    Zone de danger
                </CardTitle>
                <CardDescription>Actions irréversibles concernant votre compte</CardDescription>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                    La suppression de votre compte est une action permanente et ne peut pas être annulée. Toutes vos données
                    personnelles seront effacées conformément au RGPD.
                </p>
            </CardContent>
            <CardFooter>
                <DeleteAccountDialog/>
            </CardFooter>
        </Card>
    )
}
