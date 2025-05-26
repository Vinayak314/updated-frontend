import { NextResponse } from "next/server"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // In a real app, you would:
    // 1. Verify that the user is the buyer of this order
    // 2. Update the order status to "completed"
    // 3. Release the payment from escrow to the seller

    return NextResponse.json({
      success: true,
      status: "completed",
      paymentStatus: "released",
      message: "Order confirmed and payment released to seller.",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to confirm order" }, { status: 500 })
  }
}

