// This is a mock database service
// In a real app, you would use a proper database like MongoDB or PostgreSQL

// Mock collections
const collections = {
  users: [],
  verifications: [],
  auctions: [],
  bids: [],
  rfps: [],
  rfpResponses: [],
  orders: [],
  payments: [],
  shipments: [],
}

// Mock database functions
export const db = {
  // Users
  getUser: async (id: string) => {
    return collections.users.find((user) => user.id === id)
  },

  createUser: async (userData: any) => {
    const newUser = { id: `user-${Date.now()}`, ...userData }
    collections.users.push(newUser)
    return newUser
  },

  // Verifications
  getVerification: async (id: string) => {
    return collections.verifications.find((v) => v.id === id)
  },

  createVerification: async (verificationData: any) => {
    const newVerification = { id: `ver-${Date.now()}`, ...verificationData }
    collections.verifications.push(newVerification)
    return newVerification
  },

  // Auctions
  getAuctions: async (filters: any = {}) => {
    let result = collections.auctions

    // Apply filters
    if (filters.category) {
      result = result.filter((a) => a.category === filters.category)
    }

    if (filters.status) {
      result = result.filter((a) => a.status === filters.status)
    }

    return result
  },

  getAuction: async (id: string) => {
    return collections.auctions.find((auction) => auction.id === id)
  },

  createAuction: async (auctionData: any) => {
    const newAuction = { id: `auc-${Date.now()}`, ...auctionData }
    collections.auctions.push(newAuction)
    return newAuction
  },

  // Bids
  getBids: async (auctionId: string) => {
    return collections.bids.filter((bid) => bid.auctionId === auctionId)
  },

  createBid: async (bidData: any) => {
    const newBid = { id: `bid-${Date.now()}`, ...bidData }
    collections.bids.push(newBid)
    return newBid
  },

  // RFPs
  getRFPs: async (userId: string, type: string) => {
    if (type === "received") {
      return collections.rfps.filter((rfp) => rfp.recipientId === userId && rfp.status !== "draft")
    } else if (type === "sent") {
      return collections.rfps.filter((rfp) => rfp.senderId === userId && rfp.status !== "draft")
    } else if (type === "drafts") {
      return collections.rfps.filter((rfp) => rfp.senderId === userId && rfp.status === "draft")
    }
    return []
  },

  getRFP: async (id: string) => {
    return collections.rfps.find((rfp) => rfp.id === id)
  },

  createRFP: async (rfpData: any) => {
    const newRFP = { id: `rfp-${Date.now()}`, ...rfpData }
    collections.rfps.push(newRFP)
    return newRFP
  },

  // RFP Responses
  getRFPResponses: async (rfpId: string) => {
    return collections.rfpResponses.filter((response) => response.rfpId === rfpId)
  },

  createRFPResponse: async (responseData: any) => {
    const newResponse = { id: `resp-${Date.now()}`, ...responseData }
    collections.rfpResponses.push(newResponse)
    return newResponse
  },

  // Orders
  getOrders: async (userId: string, role: string, status?: string) => {
    let result = []

    if (role === "buyer") {
      result = collections.orders.filter((order) => order.buyerId === userId)
    } else if (role === "seller") {
      result = collections.orders.filter((order) => order.sellerId === userId)
    }

    if (status) {
      result = result.filter((order) => order.status === status)
    }

    return result
  },

  getOrder: async (id: string) => {
    return collections.orders.find((order) => order.id === id)
  },

  createOrder: async (orderData: any) => {
    const newOrder = { id: `ord-${Date.now()}`, ...orderData }
    collections.orders.push(newOrder)
    return newOrder
  },

  updateOrder: async (id: string, updates: any) => {
    const orderIndex = collections.orders.findIndex((order) => order.id === id)
    if (orderIndex !== -1) {
      collections.orders[orderIndex] = { ...collections.orders[orderIndex], ...updates }
      return collections.orders[orderIndex]
    }
    return null
  },

  // Payments
  createPayment: async (paymentData: any) => {
    const newPayment = { id: `pay-${Date.now()}`, ...paymentData }
    collections.payments.push(newPayment)
    return newPayment
  },

  // Shipments
  createShipment: async (shipmentData: any) => {
    const newShipment = { id: `ship-${Date.now()}`, ...shipmentData }
    collections.shipments.push(newShipment)
    return newShipment
  },

  getShipment: async (orderId: string) => {
    return collections.shipments.find((shipment) => shipment.orderId === orderId)
  },
}

