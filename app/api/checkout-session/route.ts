import { NextResponse } from "next/server";
import { headers } from "next/headers";

import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");

    // Récupérer les données du corps de la requête
    const body = await request.json();
    const {
      priceId,
      amount,
      packageName,
      quantity = 1,
      packageCode,
      transactionId,
    } = body;

    // Vérifier si nous avons soit un priceId, soit un montant
    if (!priceId && !amount) {
      return NextResponse.json(
        { error: "Either priceId or amount is required" },
        { status: 400 }
      );
    }

    let lineItems;

    if (priceId) {
      // Utiliser le priceId existant
      lineItems = [
        {
          price: priceId,
          quantity: quantity,
        },
      ];
    } else {
      // Créer un prix à la volée basé sur le montant
      lineItems = [
        {
          price_data: {
            currency: "usd", // ou 'usd' selon votre devise
            product_data: {
              name: packageName || "Default Package",
            },
            unit_amount: Math.round(parseFloat(amount) * 100), // Convertir en centimes
          },
          quantity: quantity,
        },
      ];
    }

    // Create Checkout Sessions from body params.
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      metadata: {
        packageName: packageName || "Default Package",
        packageCode: packageCode || "Default Package",
        transactionId: transactionId || "",
      },
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/?canceled=true`,
    });

    console.log(session);
    // Retourner l'URL de la session au lieu de rediriger directement
    return NextResponse.json({ url: session.url, session: session });
  } catch (err: any) {
    console.error("Stripe error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    );
  }
}
