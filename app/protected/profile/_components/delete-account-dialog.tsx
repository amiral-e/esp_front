"use client"

import { useState } from "react"
import { AlertTriangle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { deleteUser, getUserInfo } from "@/actions/oauth"

export function DeleteAccountDialog() {
    const [isOpen, setIsOpen] = useState(false)
    const [confirmation, setConfirmation] = useState("")
    const [isDeleting, setIsDeleting] = useState(false)
    const router = useRouter()

    const handleDeleteAccount = async () => {
        if (confirmation !== "SUPPRIMER") return

        setIsDeleting(true)
        try {
            const user = await getUserInfo()
            if (!user) {
                toast.error("Utilisateur non trouvé")
                return
            }
            const success = await deleteUser(user.id)
            toast.success("Votre compte a été supprimé avec succès")
            setIsOpen(false)
            // Redirect to home page or logout page after successful deletion
            router.push("/")
        } catch (error) {
            toast.error("Une erreur est survenue lors de la suppression du compte")
            console.error("Error deleting account:", error)
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Supprimer mon compte
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Supprimer votre compte
                    </DialogTitle>
                    <DialogDescription>
                        Cette action est irréversible. Toutes vos données personnelles seront définitivement supprimées.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    <div className="bg-amber-50 border border-amber-200 rounded-md p-3 text-sm text-amber-800">
                        <p>En supprimant votre compte :</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Toutes vos conversations seront supprimées</li>
                            <li>Vos documents et rapports seront effacés</li>
                            <li>Vos informations personnelles seront supprimées de nos serveurs</li>
                            <li>Vous perdrez l'accès à tous vos crédits restants</li>
                        </ul>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmation" className="text-sm font-medium">
                            Pour confirmer, veuillez saisir <span className="font-bold">SUPPRIMER</span> ci-dessous
                        </Label>
                        <Input
                            id="confirmation"
                            value={confirmation}
                            onChange={(e) => setConfirmation(e.target.value)}
                            placeholder="SUPPRIMER"
                            className="w-full"
                        />
                    </div>
                </div>
                <DialogFooter className="flex flex-col sm:flex-row gap-2">
                    <Button variant="outline" onClick={() => setIsOpen(false)} className="sm:w-auto w-full">
                        Annuler
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={confirmation !== "SUPPRIMER" || isDeleting}
                        className="sm:w-auto w-full"
                    >
                        {isDeleting ? "Suppression en cours..." : "Confirmer la suppression"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}