// This is a mock escrow service
// In a real app, you would integrate with a proper escrow payment provider

// Mock escrow accounts
const escrowAccounts = []

export const escrow = {
  // Create an escrow account for a transaction
  create: async (params: {
    orderId: string
    buyerId: string
    sellerId: string
    amount: number
    currency: string
  }) => {
    const { orderId, buyerId, sellerId, amount, currency } = params

    const escrowAccount = {
      id: `escrow-${Date.now()}`,
      orderId,
      buyerId,
      sellerId,
      amount,
      currency,
      status: "created",
      createdAt: new Date().toISOString(),
    }

    escrowAccounts.push(escrowAccount)

    return escrowAccount
  },

  // Fund an escrow account
  fund: async (escrowId: string, paymentMethod: string) => {
    const escrowIndex = escrowAccounts.findIndex((e) => e.id === escrowId)

    if (escrowIndex !== -1) {
      escrowAccounts[escrowIndex].status = "funded"
      escrowAccounts[escrowIndex].fundedAt = new Date().toISOString()
      escrowAccounts[escrowIndex].paymentMethod = paymentMethod

      return escrowAccounts[escrowIndex]
    }

    return null
  },

  // Release funds from escrow to the seller
  release: async (escrowId: string) => {
    const escrowIndex = escrowAccounts.findIndex((e) => e.id === escrowId)

    if (escrowIndex !== -1) {
      escrowAccounts[escrowIndex].status = "released"
      escrowAccounts[escrowIndex].releasedAt = new Date().toISOString()

      return escrowAccounts[escrowIndex]
    }

    return null
  },

  // Get an escrow account
  get: async (escrowId: string) => {
    return escrowAccounts.find((e) => e.id === escrowId)
  },

  // Get escrow accounts for an order
  getByOrder: async (orderId: string) => {
    return escrowAccounts.find((e) => e.orderId === orderId)
  },
}

