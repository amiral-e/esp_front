"use client"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import convertToSubcurrency from "@/lib/convertToSubcurrency"
import { ShieldCheck } from "lucide-react"
import CheckoutPage from "../_components/CheckoutPage"

// Move this outside the component to avoid hydration issues
let stripePromise: ReturnType<typeof loadStripe> | null = null
if (typeof window !== "undefined") {
  if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY === undefined) {
    throw new Error("NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is not defined")
  }
  stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
}

export default function Home() {
  const amount = 1.99

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">ComptaCompanion</h1>
          <p className="mt-2 text-lg text-gray-600">Secure payment portal</p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Payment Request</h2>
          </div>

          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Service fee</span>
              <span className="text-gray-900 font-medium">${amount}</span>
            </div>
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900 font-medium">$0.00</span>
            </div>
            <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
              <span className="text-gray-800 font-semibold">Total</span>
              <span className="text-gray-900 font-bold">${amount}</span>
            </div>
          </div>

          <div className="px-6 py-6">
            {stripePromise && (
              <Elements
                stripe={stripePromise}
                options={{
                  mode: "payment",
                  amount: convertToSubcurrency(amount),
                  currency: "usd",
                }}
              >
                <CheckoutPage amount={amount} />
              </Elements>
            )}

            <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
              <ShieldCheck className="h-4 w-4 text-green-500 mr-2" />
              <span>Your payment is secured with SSL encryption</span>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ComptaCompanion. All rights reserved.</p>
        </div>
      </div>
    </main>
  )
}

