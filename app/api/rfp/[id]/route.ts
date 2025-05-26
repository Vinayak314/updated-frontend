import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const rfpId = params.id

    // In a real app, you would fetch the RFP details from the database

    // Mock data
    const rfp = {
      id: rfpId,
      title: "Bulk Order of Premium Cotton Textiles",
      sender: "Dubai Imports LLC",
      senderId: "user-456",
      recipient: "Textile Exports Ltd.",
      recipientId: "user-123",
      date: "June 15, 2025",
      status: "pending",
      category: "Textiles",
      description:
        "Looking for high-quality cotton textiles for our retail chain. We require samples and detailed specifications before finalizing the order. We are interested in establishing a long-term relationship with reliable suppliers who can consistently deliver premium products.",
      requirements: [
        "100% Organic Cotton",
        "Weight: 180-200 GSM",
        "Width: 58-60 inches",
        "GOTS Certification required",
        "Multiple color options",
        "Minimum order: 5,000 kg initially",
        "Regular orders of 10,000-15,000 kg monthly",
      ],
      timeline: [
        "Sample submission: Within 2 weeks",
        "Sample evaluation: 1 week",
        "Initial order placement: By July 15, 2025",
        "Delivery required: By August 30, 2025",
      ],
      additionalInfo:
        "We prefer suppliers who can provide complete documentation including test reports, certifications, and sustainability practices. Price competitiveness is important, but quality and reliability are our primary concerns. We are open to negotiation on terms for the right supplier.",
      attachments: [
        { name: "Requirements_Specification.pdf", url: "#" },
        { name: "Product_Samples.jpg", url: "#" },
        { name: "Terms_and_Conditions.pdf", url: "#" },
      ],
      buyer: {
        name: "Dubai Imports LLC",
        location: "Dubai, UAE",
        businessType: "Retail Chain",
        previousOrders: 32,
        rating: 4.9,
        reviews: 28,
        memberSince: "2023",
      },
      responses: [],
    }

    return NextResponse.json({
      success: true,
      rfp,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch RFP details" }, { status: 500 })
  }
}

