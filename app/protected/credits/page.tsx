"use client";

import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CreditsDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState(0);

  useEffect(() => {
    // Simuler un appel API pour récupérer le solde de crédits
    const fetchCredits = async () => {
      try {
        const res = await fetch("/api/user/credits");
        const data = await res.json();
        setCredits(data.credits);
      } catch (error) {
        console.error("Erreur lors de la récupération des crédits:", error);
      }
    };
    fetchCredits();
  }, []);

  const handlePurchase = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const { id } = await res.json();
      
      const stripe = await stripePromise;
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId: id });
      }
    } catch (error) {
      console.error("Erreur lors de l'achat :", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-gray-900">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord des crédits</h1>
      <p className="mb-6 text-lg">Solde actuel : <span className="font-semibold">{credits} crédits</span></p>
      <div className="bg-white shadow-lg rounded-lg p-6 flex flex-col items-center">
        <p className="text-gray-700 mb-4">Achetez plus de crédits pour continuer à utiliser nos services.</p>
        <button
          onClick={handlePurchase}
          disabled={loading}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition"
        >
          {loading ? "Redirection..." : "Acheter des crédits"}
        </button>
      </div>
    </div>
  );
};

export default CreditsDashboard;
