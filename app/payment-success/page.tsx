"use client"

import { useSearchParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import { updateMontant } from "@/app/actions"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccess() {
  return (
    <Suspense fallback={<Loading />}>
      <PaymentSuccessContent />
    </Suspense>
  )
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const amount = searchParams.get("amount") || "0"
  const [updateStatus, setUpdateStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string>("")

  useEffect(() => {
    const updatePaymentData = async () => {
      try {
        // Parse amount as a number
        const amountValue = Number.parseFloat(amount)
        if (isNaN(amountValue)) {
          throw new Error("Invalid amount")
        }

        await updateMontant(amountValue)
        setUpdateStatus("success")
      } catch (error) {
        console.error("Error updating amount:", error)
        setUpdateStatus("error")
        setErrorMessage(error instanceof Error ? error.message : "Failed to update payment data")
      }
    }

    updatePaymentData()
  }, [amount])

  // Move date formatting to useEffect to avoid hydration mismatch
  const [formattedDate, setFormattedDate] = useState("")

  useEffect(() => {
    setFormattedDate(
      new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    )
  }, [])

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {updateStatus === "success" ? (
            <div className="text-center py-8 px-6 bg-green-50 border-b border-green-100">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h1 className="text-3xl font-extrabold text-gray-900">Payment Successful!</h1>
              <p className="mt-2 text-lg text-gray-600">Thank you for your payment</p>
            </div>
          ) : updateStatus === "error" ? (
            <div className="text-center py-8 px-6 bg-red-50 border-b border-red-100">
              <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h1 className="text-3xl font-extrabold text-gray-900">Payment Error</h1>
              <p className="mt-2 text-lg text-gray-600">There was a problem processing your payment</p>
            </div>
          ) : (
            <div className="text-center py-8 px-6 bg-blue-50 border-b border-blue-100">
              <Loader2 className="h-16 w-16 text-blue-500 mx-auto mb-4 animate-spin" />
              <h1 className="text-3xl font-extrabold text-gray-900">Processing Payment</h1>
              <p className="mt-2 text-lg text-gray-600">Please wait while we confirm your payment</p>
            </div>
          )}

          <div className="px-6 py-6">
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Receipt</h2>

              <div className="space-y-3">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="text-gray-900 font-bold">${amount}</span>
                </div>
                {/* <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-gray-900">{formattedDate}</span>
                </div> */}
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-600">Payment Method:</span>
                  <span className="text-gray-900">Credit Card</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  {updateStatus === "success" ? (
                    <span className="text-green-600 font-medium">Completed</span>
                  ) : updateStatus === "error" ? (
                    <span className="text-red-600 font-medium">Failed</span>
                  ) : (
                    <span className="text-blue-600 font-medium">Processing</span>
                  )}
                </div>
              </div>
            </div>

            {updateStatus === "error" && (
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                <p className="font-medium">Error Details:</p>
                <p>{errorMessage || "Failed to update payment data. Please contact support."}</p>
              </div>
            )}

            <div className="mt-8 text-center">
              <Link
                href="protedtec/chat"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Return to Chat
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ComptaCompanion. All rights reserved.</p>
          <p className="mt-2">A receipt has been sent to your email address.</p>
        </div>
      </div>
    </main>
  )
}

function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-8 text-center">
        <Loader2 className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Processing Payment</h2>
        <p className="text-gray-600">Please wait while we confirm your transaction...</p>
      </div>
    </div>
  )
}