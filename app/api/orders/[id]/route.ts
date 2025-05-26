import { NextResponse } from "next/server"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const orderId = params.id

    // In a real app, you would fetch the order details from the database

    // Mock data
    const order = {
      id: orderId,
      product: "Premium Cotton Textiles",
      seller: {
        name: "Textile Exports Ltd.",
        id: "seller-123",
        contactPerson: "Rajesh Sharma",
        email: "contact@textileexports.com",
        phone: "+91 98765 43210",
        verified: true,
      },
      buyer: {
        name: "Dubai Imports LLC",
        id: "buyer-456",
        contactPerson: "Ahmed Al Maktoum",
        email: "orders@dubaiimports.ae",
        phone: "+971 50 123 4567",
        verified: true,
      },
      date: "June 20, 2025",
      status: "processing",
      timeline: [
        {
          step: "Order Placed",
          completed: true,
          date: "June 20, 2025 at 10:30 AM",
          description: "Your order has been placed successfully.",
        },
        {
          step: "Payment Completed",
          completed: true,
          date: "June 20, 2025 at 10:35 AM",
          description: "Payment of $14,750.00 has been processed and held in escrow.",
        },
        {
          step: "Processing Order",
          completed: false,
          date: "Estimated: June 25, 2025",
          description: "Seller is preparing your order for shipment.",
        },
        {
          step: "Shipped",
          completed: false,
          date: "Estimated: July 5, 2025",
          description: "",
        },
        {
          step: "Delivered",
          completed: false,
          date: "Estimated: July 20, 2025",
          description: "",
        },
      ],
      items: [
        {
          name: "Premium Cotton Textiles",
          description: "100% Organic Cotton, 180-200 GSM",
          unitPrice: 14.75,
          quantity: 1000,
          unit: "kg",
          total: 14750.0,
          image: "/placeholder.svg",
        },
      ],
      payment: {
        subtotal: 14750.0,
        shipping: 1200.0,
        taxes: 950.0,
        platformFee: 295.0,
        total: 16605.0,
        method: "Bank Transfer",
        transactionId: "TRX-2025-78901",
        date: "June 20, 2025",
        status: "paid",
        escrow: true,
      },
      shipping: {
        from: {
          name: "Textile Exports Ltd.",
          address: "123 Industrial Area",
          city: "Mumbai",
          state: "Maharashtra",
          postalCode: "400001",
          country: "India",
        },
        to: {
          name: "Dubai Imports LLC",
          address: "456 Business Bay",
          city: "Dubai",
          country: "United Arab Emirates",
        },
        method: "Sea Freight",
        estimatedDelivery: "July 15-20, 2025",
        trackingNumber: null,
        status: "preparing",
      },
    }

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch order details" }, { status: 500 })
  }
}

