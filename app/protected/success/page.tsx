"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { CheckCircle, AlertCircle } from "lucide-react"
import axios from "axios"

export default function SuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const sessionId = searchParams.get("session_id")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sessionDetails, setSessionDetails] = useState<any>(null)
  const [creditsUpdated, setCreditsUpdated] = useState(false)
  const [updateAttempted, setUpdateAttempted] = useState(false)

  useEffect(() => {
    async function fetchSessionAndUpdateCredits() {
      if (!sessionId) {
        setError("No session ID found")
        setIsLoading(false)
        return
      }

      try {
        // Fetch session details
        console.log(`[success] Fetching session details for ${sessionId}`)
        const response = await fetch(`/api/get-session?session_id=${sessionId}`)

        if (!response.ok) {
          throw new Error(`Failed to fetch session details: ${response.status}`)
        }

        const data = await response.json()
        setSessionDetails(data.session)
        console.log(`[success] Session details:`, data.session)

        // Check if payment was successful
        if (data.session.payment_status === "paid") {
          const amount = data.session.amount_total / 100
          console.log(`[success] Payment successful. Amount: ${amount}`)

          // Update user credits
          try {
            setUpdateAttempted(true)
            const updateResponse = await axios.post("/api/update-credits", {
              amount,
              sessionId,
            })

            if (updateResponse.data.success) {
              setCreditsUpdated(true)
              console.log(`[success] Credits updated successfully`)
            } else {
              console.error(`[success] Failed to update credits:`, updateResponse.data)
              setError("Credits could not be updated. Please contact support.")
            }
          } catch (updateError) {
            console.error(`[success] Error updating credits:`, updateError)
            setError("Failed to update credits. Please contact support.")
          }
        } else {
          console.log(`[success] Payment not completed. Status: ${data.session.payment_status}`)
          setError(`Payment not completed. Status: ${data.session.payment_status}`)
        }
      } catch (err) {
        console.error("[success] Error processing success page:", err)
        setError("An error occurred while processing your payment")
      } finally {
        setIsLoading(false)
      }
    }

    fetchSessionAndUpdateCredits()
  }, [sessionId])

  const handleManualUpdate = async () => {
    if (!sessionDetails?.amount_total) {
      setError("No payment amount found")
      return
    }

    setIsLoading(true)
    try {
      const amount = sessionDetails.amount_total / 100
      const response = await axios.post("/api/update-credits", {
        amount,
        sessionId,
      })

      if (response.data.success) {
        setCreditsUpdated(true)
        setError(null)
      } else {
        setError("Failed to update credits. Please contact support.")
      }
    } catch (err) {
      console.error("[success] Manual update error:", err)
      setError("Failed to update credits. Please contact support.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-md py-16">
      <div className="flex flex-col items-center justify-center text-center space-y-6">
        {isLoading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-lg">Traitement de votre paiement...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-red-100 p-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold">Erreur</h1>
            <p className="text-muted-foreground">{error}</p>

            {updateAttempted && !creditsUpdated && sessionDetails?.amount_total && (
              <Button onClick={handleManualUpdate} className="mt-4">
                Réessayer de mettre à jour les crédits
              </Button>
            )}

            <Button onClick={() => router.push("/")} variant="outline" className="mt-2">
              Retour à l'accueil
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-full bg-green-100 p-3">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold">Paiement réussi!</h1>

            {creditsUpdated ? (
              <p className="text-muted-foreground">
                Votre paiement a été traité avec succès et vos crédits ont été ajoutés à votre compte.
              </p>
            ) : (
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Votre paiement a été traité avec succès, mais nous n'avons pas pu mettre à jour vos crédits
                  automatiquement.
                </p>
                <Button onClick={handleManualUpdate}>Mettre à jour mes crédits maintenant</Button>
              </div>
            )}

            <div className="bg-muted p-4 rounded-lg w-full">
              <p className="font-medium">Détails de la transaction:</p>
              <p className="text-sm text-muted-foreground">
                Montant: {sessionDetails?.amount_total ? (sessionDetails.amount_total / 100).toFixed(2) : "0.00"}€
              </p>
              <p className="text-sm text-muted-foreground">Référence: {sessionDetails?.id?.slice(-8) || "N/A"}</p>
              <p className="text-sm text-muted-foreground">Statut: {sessionDetails?.payment_status || "N/A"}</p>
            </div>

            <Button onClick={() => router.push("/")} className="mt-6">
              Retour à l'accueil
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}