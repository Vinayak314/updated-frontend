"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowRight, CheckCircle2 } from "lucide-react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCheck, faGlobeAfrica, faGavel, faMoneyBillTransfer, faRankingStar } from "@fortawesome/free-solid-svg-icons"

export default function Home() {
  const [recentAuction, setRecentAuction] = useState(null)
  const [auctionLoading, setAuctionLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isImporter, setIsImporter] = useState(false)

  useEffect(() => {
    // Check user status
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    setIsLoggedIn(!!userData.id)
    setIsImporter(userData.user_type === "importer")
    
    fetchRecentAuction()
  }, [])

  const fetchRecentAuction = async () => {
    try {
      const response = await fetch("https://zecbay-backend.vercel.app/api/auctions/")
      const data = await response.json()

      if (data.auctions && Array.isArray(data.auctions) && data.auctions.length > 0) {
        // Get the most recent active auction
        const activeAuctions = data.auctions.filter(auction => 
          auction.time_left !== "Auction ended" && auction.status !== "completed"
        )
        
        const auctionsToSort = activeAuctions.length > 0 ? activeAuctions : data.auctions
        
        const sortedAuctions = auctionsToSort.sort((a, b) => {
          const dateA = new Date(a.created_at)
          const dateB = new Date(b.created_at)
          return dateB.getTime() - dateA.getTime()
        })

        const mostRecentAuction = sortedAuctions[0]
        
        // Process the auction data
        let status = "active"
        let currentPrice = mostRecentAuction.initial_price
        let userHasBid = false

        if (mostRecentAuction.time_left === "Auction ended") {
          status = "completed"
        }

        // Get current price from bids
        if (mostRecentAuction.bids && mostRecentAuction.bids.length > 0) {
          const lowestBid = mostRecentAuction.bids.reduce((prev, current) => {
            return prev.price < current.price ? prev : current
          })
          currentPrice = lowestBid?.price || mostRecentAuction.initial_price

          // Check if user has bid
          const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id
          if (userId) {
            userHasBid = mostRecentAuction.bids.some(bid => bid.user_id === userId)
          }
        }

        setRecentAuction({
          ...mostRecentAuction,
          status,
          currentPrice,
          userHasBid
        })
      }
    } catch (error) {
      console.log("Error fetching recent auction:", error)
    } finally {
      setAuctionLoading(false)
    }
  }

  // Update time left every second for active auctions
  useEffect(() => {
    if (!recentAuction || recentAuction.status !== "active") return

    const timer = setInterval(() => {
      setRecentAuction(prevAuction => {
        if (!prevAuction || prevAuction.time_left === "Auction ended") return prevAuction

        const [hours, minutes, seconds] = prevAuction.time_left.split(":").map(Number)
        let totalSeconds = hours * 3600 + minutes * 60 + seconds

        if (totalSeconds > 0) {
          totalSeconds -= 1
        }

        const remainingHours = Math.floor(totalSeconds / 3600)
        const remainingMinutes = Math.floor((totalSeconds % 3600) / 60)
        const remainingSeconds = totalSeconds % 60

        const formattedTime = totalSeconds <= 0 
          ? "Auction ended" 
          : `${remainingHours.toString().padStart(2, "0")}:${remainingMinutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`

        return {
          ...prevAuction,
          time_left: formattedTime,
          status: totalSeconds <= 0 ? "completed" : "active"
        }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [recentAuction])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-row text-left justify-between max-md:flex-col items-center">
            <div className="flex flex-col">
              <div className="animate-fade-in mt-4 max-md:items-center">
                <p className="pt-2 font-bold text-3xl text-muted-foreground max-md:text-center">
                  Welcome to
                </p>
                <h1 className="font-helvetica pb-4 text-8xl font-bold tracking-tighter bg-gradient-to-b from-primary to-secondary bg-clip-text text-transparent max-md:text-center">
                    ZecBay
                </h1>
                <p className="pt-2 text-2xl text-muted-foreground max-md:text-center">
                  Trade Smarter. Bid Better. Grow Bigger.
                </p>
              </div>
            </div>
            <div className="hidden md:block">
              <img src="/worldimagerbg.png" alt="" className="w-[650px] h-[300px]"/>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full mt-16 py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Why Choose ZecBay</h2>
            <p className="max-w-[700px] text-xl text-muted-foreground">
              ZecBay provides a secure auction-based marketplace for international trade with verified businesses
            </p>
            <h4 className="text-xl pt-12 font-bold tracking-tight sm:text-3xl md:text-3xl">
              Our platform offers unique features designed for international trade
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
            {/* Feature 1 */}
            <div className="bg-background rounded-lg p-6 shadow-sm border">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full shrink-0">
                  <FontAwesomeIcon icon={faUserCheck} className="text-primary h-12 w-12"/>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Verified Businesses</h3>
                  <p className="text-muted-foreground mt-2">
                    All exporters and importers go through a rigorous verification process to ensure trust and security.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-background rounded-lg p-6 shadow-sm border">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full shrink-0">
                  <FontAwesomeIcon icon={faGavel} className="text-primary h-12 w-12"/>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Reverse Auction System</h3>
                  <p className="text-muted-foreground mt-2">
                    Our unique auction system ensures fair pricing through a bidding round.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="bg-background rounded-lg p-6 shadow-sm border">
              <div className="flex items-start space-x-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full shrink-0">
                  <FontAwesomeIcon icon={faMoneyBillTransfer} className="text-primary h-12 w-12"/>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Secure Payments</h3>
                  <p className="text-muted-foreground mt-2">
                    Escrow payment system protects both buyers and sellers throughout the transaction.
                  </p>
                </div>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="bg-background rounded-lg p-6 shadow-sm border">
              <div className="flex items-start space-x-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full shrink-0">
                  <FontAwesomeIcon icon={faRankingStar} className="text-primary h-12 w-12"/>
                </div>
                <div>
                  <h3 className="text-xl font-bold">Rating System</h3>
                  <p className="text-muted-foreground mt-2">
                    Build your reputation through our comprehensive rating and review system.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Trade Smarter, in 4 Simple Moves</h2>
            <p className="max-w-[700px] text-xl text-muted-foreground">
              A four step guide to using our platform for seamless international trade.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl font-bold text-primary">1</span>
                </div>
              </div>
              <h3 className="text-xl font-bold">Register & Verify</h3>
              <p className="max-w-[300px] text-muted-foreground">
                Sign up and complete the verification process with your business details.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl font-bold text-primary">2</span>
                </div>
              </div>
              <h3 className="text-xl font-bold">List or Bid</h3>
              <p className="max-w-[250px] text-muted-foreground">
              Importers list products; exporters bid on auctions
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl font-bold text-primary">3</span>
                </div>
              </div>
              <h3 className="text-xl font-bold">Complete Auction</h3>
              <p className="max-w-[250px] text-muted-foreground">
                Post a need and watch sellers compete
              </p>
            </div>

            <div className="flex flex-col justify-self-center items-center text-center space-y-3">
              <div className="relative">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <span className="text-xl font-bold text-primary">4</span>
                </div>
              </div>
              <h3 className="text-xl font-bold">Chat With Leads</h3>
              <p className="max-w-[400px] text-muted-foreground">
              Connect to best bids via <span className="font-bold">Zecbay Chat</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Auction Section */}
      <section className="w-full py-12 md:py-16">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Ongoing Auctions</h2>
              <p className="max-w-[600px] text-lg text-muted-foreground mt-2">
                Don't miss out on the newest trading opportunity
              </p>
            </div>

            {auctionLoading ? (
              <div className="flex justify-center items-center py-12">
                <img src="/loader.svg" alt="Loading..." className="w-24 h-24" />
              </div>
            ) : recentAuction ? (
              <Card className="w-full max-w-4xl mx-auto overflow-hidden">
                <div className="flex flex-col p-6 space-y-4 relative">
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="default" className="animate-pulse">
                      {recentAuction.status === "active" ? "🔴 Live" : "Completed"}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-start px-2">
                      <div  className="flex flex-col justify-between items-start max-sm:items-center">
                        <Badge variant="outline" className="my-2 mx-0 text-sm bg-gray-200">
                          {recentAuction.category} - {recentAuction.subcategory}
                        </Badge>
                        <CardTitle className="text-2xl">
                          {recentAuction.product_name}
                          {recentAuction.variant && (
                            <span className="text-lg font-normal ml-2">({recentAuction.variant})</span>
                          )}
                        </CardTitle>
                      </div>
                    </div>

                    {/* Auction Details Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div className="text-center p-3 bg-background rounded-lg">
                        <p className="text-muted-foreground">Created by</p>
                        <p className="font-bold text-primary">{recentAuction.created_by}</p>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg">
                        <p className="text-muted-foreground">Current Price</p>
                        <span className="font-bold text-green-600 text-lg">₹{recentAuction.currentPrice.toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground"> per {recentAuction.unit}</span>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg">
                        <p className="text-muted-foreground">Time Left</p>
                        <p className="font-bold text-red-600">{recentAuction.time_left}</p>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Round {recentAuction.round} of {recentAuction.total_rounds}</span>
                        <span>{recentAuction.bids_count || 0} bids placed</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <div
                          className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(0, 100 - (parseInt(recentAuction.time_left.split(':')[0]) * 4))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button asChild className="flex-1">
                      <Link href={isLoggedIn ? `/auctions/${recentAuction.id}` : "/login"}>
                        {recentAuction.status === "active" ? (
                          isLoggedIn ? (
                            isImporter || !recentAuction.userHasBid ? "Join Auction" : "View Your Bid"
                          ) : (
                            "Login to Participate"
                          )
                        ) : (
                          "View Results"
                        )}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card className="w-full max-w-md">
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No active auctions at the moment</p>
                </CardContent>
              </Card>
            )}
            <Button asChild className="mt-4">
                    <Link href="/auctions">Browse All Auctions</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-3/4 mx-auto py-12 mb-4 md:py-24 lg:py-32 bg-muted/90 rounded-xl">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center text-secondary">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Deals Don't Wait. Neither Should You</h2>
            <p className="max-w-[700px] text-lg">
            Tap into a fast-moving B2B auction network made for businesses like yours
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button asChild size="lg" className="bg-white text-primary text-bold hover:bg-gray-300">
                <Link href="/signup">Create Account</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-primary text-bold hover:bg-gray-300 ">
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}