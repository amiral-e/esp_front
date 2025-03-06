"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import convertToSubcurrency from "@/lib/convertToSubcurrency"
import { Loader2, AlertCircle, CreditCard } from "lucide-react"

const CheckoutPage = ({ amount }: { amount: number }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [errorMessage, setErrorMessage] = useState<string>()
  const [clientSecret, setClientSecret] = useState("")
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => {
        setClientSecret(data.clientSecret)
        setInitialLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching client secret:", error)
        setErrorMessage("Failed to initialize payment. Please try again.")
        setInitialLoading(false)
      })
  }, [amount])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    if (!stripe || !elements) {
      setLoading(false)
      return
    }

    const { error: submitError } = await elements.submit()

    if (submitError) {
      setErrorMessage(submitError.message)
      setLoading(false)
      return
    }

    // Fix the template literal syntax for return_url
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success?amount=${amount}`,
      },
    })

    if (error) {
      console.error("Error in confirmPayment:", error)
      setErrorMessage(error.message)
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Initializing payment...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-md p-4 border border-gray-200">
        <div className="flex items-center mb-4">
          <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
          <h3 className="text-gray-700 font-medium">Payment Details</h3>
        </div>

        {clientSecret ? (
          <PaymentElement className="payment-element" />
        ) : (
          <div className="py-4 text-center text-gray-500">Unable to load payment form. Please refresh the page.</div>
        )}
      </div>

      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" />
          <div className="text-red-700 text-sm">{errorMessage}</div>
        </div>
      )}

      <button
        disabled={!stripe || loading || !clientSecret}
        className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed"
        type="submit"
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Processing...
          </span>
        ) : (
          `Pay $${amount}`
        )}
      </button>

      <p className="text-xs text-gray-500 text-center">
        Your card will be charged ${amount}. By proceeding, you agree to our terms of service.
      </p>
    </form>
  )
}

export default CheckoutPage

