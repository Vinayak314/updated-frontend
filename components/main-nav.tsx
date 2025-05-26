"use client"

import type * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      <Link
        href="/"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Home
      </Link>
      <Link
        href="/auctions"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/auctions" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Auctions
      </Link>
      <Link
        href="/rfp"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/rfp" ? "text-primary" : "text-muted-foreground",
        )}
      >
        RFP Exchange
      </Link>
      <Link
        href="/orders"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          pathname === "/orders" ? "text-primary" : "text-muted-foreground",
        )}
      >
        Orders
      </Link>
    </nav>
  )
}

