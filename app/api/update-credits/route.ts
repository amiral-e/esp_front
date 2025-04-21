import { NextResponse } from "next/server"
import { updateMontantForUser } from "@/actions/prices"
import { getUserInfo } from "@/actions/oauth"

export async function POST(request: Request) {
  try {
    // Get the current user
    const userInfo = await getUserInfo()
    if (!userInfo?.id) {
      return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 })
    }

    // Get request body
    const body = await request.json()
    const { amount, sessionId } = body

    if (!amount || isNaN(Number.parseFloat(amount)) || Number.parseFloat(amount) <= 0) {
      return NextResponse.json({ success: false, error: "Invalid amount" }, { status: 400 })
    }

    console.log(`[update-credits] Updating credits for user ${userInfo.id} with amount ${amount}`)

    // Call the update function
    try {
      await updateMontantForUser(userInfo.id, Number.parseFloat(amount))
      console.log(`[update-credits] Credits updated successfully`)

      return NextResponse.json({
        success: true,
        message: "Credits updated successfully",
        userId: userInfo.id,
        amount: Number.parseFloat(amount),
        sessionId,
      })
    } catch (error) {
      console.error("[update-credits] Error updating credits:", error)
      return NextResponse.json({ success: false, error: "Failed to update credits" }, { status: 500 })
    }
  } catch (error) {
    console.error("[update-credits] Server error:", error)
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 })
  }
}