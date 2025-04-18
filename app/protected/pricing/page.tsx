"use client"

import { useState, useEffect } from "react"
import PricingCard from "./_components/pricing-card"
import PricingToggle from "./_components/pricing-toggle"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import axios from "axios"
import { getPlatformPrices, type Price } from "@/actions/prices"

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false)
  const router = useRouter()
  const [platformPrices, setPlatformPrices] = useState<Price[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await getPlatformPrices()
        if (response) {
          setPlatformPrices(response)
        }
      } catch (error) {
        console.error("Erreur lors du chargement des prix :", error)
        setError("Échec du chargement des plans tarifaires. Veuillez réessayer plus tard.")
      }
    }

    fetchPrices()
  }, [])

  const handleSelectPlan = async (priceId: string) => {
    setLoading(true)
    setError(null)

    try {
      const selectedPlan = platformPrices.find((plan) => plan.price === priceId)

      if (!selectedPlan) {
        console.error("Plan non trouvé pour l'ID de prix :", priceId)
        setError("Plan sélectionné introuvable. Veuillez réessayer.")
        return
      }

      console.log("Création de la session de paiement avec :", {
        amount: selectedPlan.value,
        packageName: selectedPlan.price,
        packageCode: selectedPlan.price,
      })

      const response = await axios.post("/api/checkout-session", {
        amount: selectedPlan.value.toString(),
        packageName: selectedPlan.price,
        packageCode: selectedPlan.price,
        quantity: 1,
        transactionId: "",
      })

      const data = response.data

      if (data.url) {
        router.push(data.url)
      } else {
        setError("Aucune URL de paiement retournée. Veuillez réessayer.")
      }
    } catch (error: any) {
      console.error("Erreur lors de la création de la session de paiement :", error)
      setError(error.response?.data?.error || "Échec de la création de la session de paiement. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <div className="container max-w-6xl py-12 text-center">
        <div className="bg-red-50 p-4 rounded-md mb-8">
          <p className="text-red-600">{error}</p>
          <Button onClick={() => setError(null)} variant="outline" className="mt-4">
            Essayer à nouveau
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Choisissez votre plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Nous proposons des plans flexibles adaptés à tous les besoins. Commencez gratuitement et évoluez à mesure que
          votre entreprise se développe.
        </p>
      </div>

      <PricingToggle isYearly={isYearly} onToggle={setIsYearly} />

      <div className="grid md:grid-cols-4 gap-8">
        {platformPrices.map((plan) => (
          <PricingCard
            key={plan.price}
            title={plan.price}
            price={plan.value}
            description={plan.description || ""}
            onSelectPlan={() => handleSelectPlan(plan.price)}
            popular={plan.price === "search"}
            buttonText={loading ? "Chargement..." : "Choisir ce plan"}
            disabled={loading}
          />
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-xl font-semibold mb-4">Vous avez des questions ?</h2>
        <p className="text-muted-foreground mb-4">
          Contactez notre équipe commerciale pour obtenir plus d'informations sur nos plans et services.
        </p>
        <Button variant="outline">Nous contacter</Button>
      </div>
    </div>
  )
}