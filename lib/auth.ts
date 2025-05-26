// This is a mock authentication service
// In a real app, you would use a proper authentication provider like NextAuth.js, Auth0, or Firebase Auth

import { cookies } from "next/headers"

// Mock user data
const users = [
  {
    id: "user-123",
    name: "Textile Exports Ltd.",
    email: "contact@textileexports.com",
    role: "exporter",
    verified: true,
  },
  {
    id: "user-456",
    name: "Dubai Imports LLC",
    email: "info@dubaiimports.ae",
    role: "importer",
    verified: true,
  },
]

export const auth = {
  // Sign in a user
  signIn: async (email: string, password: string) => {
    // In a real app, you would validate credentials against your database
    const user = users.find((u) => u.email === email)

    if (user) {
      // Create a session token
      const token = `mock-token-${Date.now()}`

      // Set a cookie
      cookies().set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
        path: "/",
      })

      return { success: true, user }
    }

    return { success: false, error: "Invalid credentials" }
  },

  // Sign out a user
  signOut: async () => {
    cookies().delete("auth-token")
    return { success: true }
  },

  // Get the current user
  getUser: async () => {
    const token = cookies().get("auth-token")

    if (token) {
      // In a real app, you would validate the token and fetch the user
      return users[0] // Mock: always return the first user
    }

    return null
  },

  // Check if a user is authenticated
  isAuthenticated: async () => {
    const token = cookies().get("auth-token")
    return !!token
  },
}

