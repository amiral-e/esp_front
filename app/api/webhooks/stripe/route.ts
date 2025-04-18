import { NextResponse } from "next/server"
import { headers } from "next/headers"
import type Stripe from "stripe"
import { stripe } from "@/lib/stripe"
import { updateMontantForUser } from "@/actions/prices"

// This is your Stripe webhook secret for testing your endpoint locally.
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: Request) {
  try {
    console.log("[webhook] Received webhook request")

    const body = await req.text()
    const signature = (await headers()).get("Stripe-Signature") as string

    console.log("[webhook] Signature present:", !!signature)

    let event: Stripe.Event

    try {
      if (!webhookSecret) {
        console.error("[webhook] STRIPE_WEBHOOK_SECRET is not set")
        return new NextResponse("Webhook secret is not configured", { status: 500 })
      }

      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)

      console.log("[webhook] Event verified successfully:", event.type)
    } catch (err: any) {
      console.error(`[webhook] Webhook signature verification failed: ${err.message}`)
      return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      console.log("[webhook] Processing checkout.session.completed event")
      const session = event.data.object as Stripe.Checkout.Session

      console.log("[webhook] Session metadata:", session.metadata)
      console.log("[webhook] Session amount:", session.amount_total)

      // Get the user ID from the session metadata
      const userId = session.metadata?.userId

      // Get the amount from the session
      const amount = session.amount_total ? session.amount_total / 100 : 0

      console.log(`[webhook] User ID: ${userId}, Amount: ${amount}`)

      if (userId && amount > 0) {
        try {
          // Update the user's credits
          console.log(`[webhook] Updating credits for user ${userId} with amount ${amount}`)
          const result = await updateMontantForUser(userId, amount)
          console.log(`[webhook] Credits updated result:`, result)
        } catch (error) {
          console.error("[webhook] Error updating user credits:", error)
          // Continue processing even if credit update fails
        }
      } else {
        console.error("[webhook] Missing userId or amount in session metadata")
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error("[webhook] Webhook handler failed:", error)
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 })
  }
}