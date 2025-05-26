"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import Image from "next/image"

// Define a User type to handle user data structure
interface User {
  name: string
  avatar: string
}

export function Header() {
  const pathname = usePathname() || ""; // Ensure pathname is always a string
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null) // Explicit type for user
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for session or token and fetch user info
    const storedUser = JSON.parse(localStorage.getItem("user") || "null") // Safely parse or return null if nothing found
    if (storedUser) {
      setUser(storedUser)
    }
    setLoading(false)
  }, [])

  const handleLogout = () => {
    // Clear the session or token and user info
    localStorage.removeItem("user")
    setUser(null)
    // Navigate to the home page
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-background supports-[backdrop-filter]:bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo2.png"
              alt="ZecBay Logo"
              width={40}
              height={40}
              className="h-10 w-auto"
            />
            <span className="hidden font-helvetica font-bold text-2xl text-primary sm:inline-block">ZecBay</span>
          </Link>
        </div>

        <nav className="hidden md:flex flex-row justify-center ml-24 gap-4">
          {user ? null: (
            <>
            <Link
            href="/"
            className={cn(
              "text-xl font-bold transition-colors hover:text-primary",
              pathname == "/" ? "text-primary" : "text-muted-foreground",
            )}
          >
            Home
          </Link>

          <Link
            href="/about"
            className={cn(
              "text-xl font-bold transition-colors hover:text-primary",
              pathname.startsWith("/about") ? "text-primary" : "text-muted-foreground",
            )}
          >
            About Us
          </Link>
           <Link
              href="/auctions"
              className={cn(
                "text-xl font-bold transition-colors hover:text-primary",
                pathname.startsWith("/auctions") ? "text-primary" : "text-muted-foreground",
              )}
            >
              Auctions
          </Link>
          </>
          )}

          {/* Conditional rendering for Dashboard button */}
          {user ? (
            <>
             <Link
              href="/auctions"
              className={cn(
                "text-xl font-bold transition-colors hover:text-primary",
                pathname.startsWith("/auctions") ? "text-primary" : "text-muted-foreground",
              )}
            >
              Auctions
          </Link>
            <Link
              href="/dashboard"
              className={cn(
                "text-xl font-bold transition-colors hover:text-primary",
                pathname.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground",
              )}
            >
              Dashboard
            </Link>
            </>
          ) : null}

        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            ) : (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </>
            )}
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
      <div className="md:hidden animate-fade-in">
        <div className="container py-4 space-y-4">
        <nav className="flex flex-row justify-center gap-4">
              {user ? null : (
                    <Link
                      href="/"
                      className={cn(
                        "text-md font-bold transition-colors hover:text-primary",
                        pathname=="/" ? "text-primary" : "text-muted-foreground",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Home
                    </Link>
                  )}
              {user ? null : (
                    <Link
                      href="/about"
                      className={cn(
                        "text-md font-bold transition-colors hover:text-primary",
                        pathname.startsWith("/about") ? "text-primary" : "text-muted-foreground",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      About Us
                    </Link>
                  )}

              {user ? (
                    <Link
                      href="/auctions"
                      className={cn(
                        "text-md font-bold transition-colors hover:text-primary",
                        pathname.startsWith("/auctions") ? "text-primary" : "text-muted-foreground",
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Auctions
                    </Link>
                  ) : null}

              {/* Conditional rendering for Dashboard button */}
              {user ? (
                <Link
                  href="/dashboard"
                  className={cn(
                    "text-md font-bold transition-colors hover:text-primary",
                    pathname.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground",
                  )}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              ) : null}

              {user ? (
                <Link
                href="/profile"
                className={cn(
                  "text-md font-bold transition-colors hover:text-primary",
                  pathname.startsWith("/profile") ? "text-primary" : "text-muted-foreground",
                )}
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
              ): null}

            </nav>

            <div className="flex flex-col space-y-2">
              {user ? null : (
                <>
                  <Button variant="outline" asChild>
                    <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                      Sign Up
                    </Link>
                  </Button>
                </>
              )}

              {/* Logout button in mobile menu */}
              {user && (
                <Button variant="outline" size="sm" className="w-fit mx-auto"onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                  Logout
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}