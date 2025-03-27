import { NextResponse } from "next/server"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"
import { getUserInfo } from "@/app/actions"

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const origin = headersList.get("origin")

    // Get the current user session
    const authSession = await getUserInfo()
    const userId = authSession?.id

    if (!userId) {
      return NextResponse.json({ error: "User must be logged in" }, { status: 401 })
    }

    // Récupérer les données du corps de la requête
    const body = await request.json()
    const { priceId, amount, packageName, quantity = 1, packageCode, transactionId } = body

    console.log("Received request body:", body)

    // Vérifier si nous avons soit un priceId, soit un montant
    if (!priceId && !amount) {
      return NextResponse.json({ error: "Either priceId or amount is required" }, { status: 400 })
    }

    // Ensure amount is a valid number
    const parsedAmount = amount ? Number.parseFloat(amount) : 0
    if (amount && (isNaN(parsedAmount) || parsedAmount <= 0)) {
      return NextResponse.json({ error: "Amount must be a valid positive number" }, { status: 400 })
    }

    let lineItems

    if (priceId) {
      // Utiliser le priceId existant
      lineItems = [
        {
          price: priceId,
          quantity: quantity,
        },
      ]
    } else {
      // Créer un prix à la volée basé sur le montant
      lineItems = [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: packageName || "Default Package",
            },
            unit_amount: Math.round(parsedAmount * 100), // Convertir en centimes
          },
          quantity: quantity,
        },
      ]
    }

    console.log("Creating Stripe session with line items:", lineItems)

    // Create Checkout Sessions from body params.
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: lineItems,
      metadata: {
        packageName: packageName || "Default Package",
        packageCode: packageCode || "Default Package",
        transactionId: transactionId || "",
        userId: userId,
      },
      mode: "payment",
      success_url: `${origin}/protected/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
    })

    console.log("Stripe session created:", stripeSession.id)

    // Retourner l'URL de la session au lieu de rediriger directement
    return NextResponse.json({ url: stripeSession.url, session: stripeSession })
  } catch (err: any) {
    console.error("Stripe error:", err)
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 })
  }
}