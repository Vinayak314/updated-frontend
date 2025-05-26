import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const documents = formData.getAll("documents")
    const businessType = formData.get("businessType")

    // In a real app, you would:
    // 1. Validate the documents
    // 2. Store them securely
    // 3. Create a verification request in the database

    return NextResponse.json({
      success: true,
      verificationId: "ver-" + Date.now(),
      status: "pending",
      message:
        "Verification request submitted successfully. Our team will review your documents within 2-3 business days.",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to submit verification request" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    // In a real app, you would fetch the verification status from the database

    return NextResponse.json({
      success: true,
      status: "pending",
      submittedDate: "2025-06-15",
      documents: [
        { name: "Business Registration", status: "verified" },
        { name: "Identity Verification", status: "pending" },
        { name: "Business Credentials", status: "pending" },
      ],
      notes: "Your business registration has been verified. We need additional information for identity verification.",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch verification status" }, { status: 500 })
  }
}

