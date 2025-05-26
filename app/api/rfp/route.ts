import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") || "received" // received, sent, drafts

    // In a real app, you would fetch RFPs from the database based on the user and type

    // Mock data
    const rfps = [
      {
        id: "rfp-1001",
        title: "Bulk Order of Premium Cotton Textiles",
        sender: "Dubai Imports LLC",
        senderId: "user-456",
        recipient: "Current User",
        recipientId: "user-123",
        date: "June 15, 2025",
        status: "pending",
        category: "Textiles",
        description:
          "Looking for high-quality cotton textiles for our retail chain. Require samples and detailed specifications before finalizing the order.",
      },
      {
        id: "rfp-1002",
        title: "Organic Spices Collection for Export",
        sender: "Current User",
        senderId: "user-123",
        recipient: "Al Madina Trading",
        recipientId: "user-789",
        date: "June 10, 2025",
        status: "responded",
        category: "Food & Agriculture",
        description:
          "Proposal for supplying organic spices collection including turmeric, cardamom, and black pepper. Certification and quality standards included.",
      },
      {
        id: "rfp-1003",
        title: "Handcrafted Jewelry Collection",
        sender: "Draft",
        senderId: "user-123",
        recipient: "",
        recipientId: "",
        date: "Last edited: June 5, 2025",
        status: "draft",
        category: "Jewelry",
        description:
          "Draft proposal for exporting handcrafted jewelry collection featuring traditional Indian designs with modern aesthetics.",
      },
    ]

    // Filter based on type
    let filteredRFPs = rfps
    if (type === "received") {
      filteredRFPs = rfps.filter((rfp) => rfp.recipientId === "user-123" && rfp.status !== "draft")
    } else if (type === "sent") {
      filteredRFPs = rfps.filter((rfp) => rfp.senderId === "user-123" && rfp.status !== "draft")
    } else if (type === "drafts") {
      filteredRFPs = rfps.filter((rfp) => rfp.status === "draft")
    }

    return NextResponse.json({
      success: true,
      rfps: filteredRFPs,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch RFPs" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const title = formData.get("title")
    const category = formData.get("category")
    const description = formData.get("description")
    const recipientId = formData.get("recipientId")
    const isDraft = formData.get("isDraft") === "true"
    const attachments = formData.getAll("attachments")

    // In a real app, you would:
    // 1. Validate the RFP data
    // 2. Store the attachments
    // 3. Create the RFP in the database

    return NextResponse.json({
      success: true,
      rfpId: "rfp-" + Date.now(),
      status: isDraft ? "draft" : "sent",
      message: isDraft ? "RFP saved as draft" : "RFP sent successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create RFP" }, { status: 500 })
  }
}

