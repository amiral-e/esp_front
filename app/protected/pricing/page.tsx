"use client";

import React, { useState } from "react";
import PricingCard from "./_components/pricing-card";
import PricingToggle from "./_components/pricing-toggle";
import { useRouter } from "next/navigation";

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(false);
  const router = useRouter();

  const pricingPlans = [
    {
      title: "Starter",
      monthlyPrice: 9,
      yearlyPrice: 90,
      description: "Parfait pour les débutants et les projets personnels",
      features: [
        "5 conversations par jour",
        "Historique limité à 7 jours",
        "Accès aux fonctionnalités de base",
        "Support par email",
      ],
      monthlyPriceId: "price_monthly_starter_id",
      yearlyPriceId: "price_yearly_starter_id",
    },
    {
      title: "Pro",
      monthlyPrice: 29,
      yearlyPrice: 290,
      description: "Idéal pour les professionnels et les petites équipes",
      features: [
        "Conversations illimitées",
        "Historique illimité",
        "Accès à toutes les fonctionnalités",
        "Support prioritaire",
        "Intégration avec 3 outils externes",
      ],
      popular: true,
      monthlyPriceId: "price_monthly_pro_id",
      yearlyPriceId: "price_yearly_pro_id",
    },
    {
      title: "Enterprise",
      monthlyPrice: 99,
      yearlyPrice: 990,
      description: "Pour les grandes équipes et les entreprises",
      features: [
        "Tout ce qui est inclus dans Pro",
        "Utilisateurs illimités",
        "Intégrations personnalisées",
        "Gestionnaire de compte dédié",
        "Formation et onboarding personnalisés",
        "SLA garanti",
      ],
      monthlyPriceId: "price_monthly_enterprise_id",
      yearlyPriceId: "price_yearly_enterprise_id",
    },
  ];

  const handleSelectPlan = async (priceId: string) => {
    try {
      const response = await axios.post("/api/checkout-session", {
        amount: 9,
        packageName: pricingPlans.find(
          (plan) => plan.monthlyPriceId === priceId
        )?.title,
        packageCode: pricingPlans.find(
          (plan) => plan.monthlyPriceId === priceId
        )?.title,
        quantity: 1,
        transactionId: "",
      });
      const data = await response.data;

      if (data.url) {
        router.push(data.url);
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
    }
  };

  return (
    <div className="container max-w-6xl py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Choisissez votre plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Nous proposons des plans flexibles adaptés à tous les besoins.
          Commencez gratuitement et évoluez à mesure que votre entreprise se
          développe.
        </p>
      </div>

      <PricingToggle isYearly={isYearly} onToggle={setIsYearly} />

      <div className="grid md:grid-cols-3 gap-8">
        {pricingPlans.map((plan) => (
          <PricingCard
            key={plan.title}
            title={plan.title}
            price={isYearly ? plan.yearlyPrice : plan.monthlyPrice}
            description={plan.description}
            features={plan.features}
            popular={plan.popular}
            priceId={isYearly ? plan.yearlyPriceId : plan.monthlyPriceId}
            onSelectPlan={handleSelectPlan}
            buttonText={
              plan.title === "Enterprise" ? "Contactez-nous" : "Choisir ce plan"
            }
          />
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-xl font-semibold mb-4">
          Vous avez des questions ?
        </h2>
        <p className="text-muted-foreground mb-4">
          Contactez notre équipe commerciale pour obtenir plus d'informations
          sur nos plans et services.
        </p>
        <Button variant="outline">Nous contacter</Button>
      </div>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import axios from "axios";
