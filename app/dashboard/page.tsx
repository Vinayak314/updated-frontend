"use client"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Bell, ShieldCheck, User,} from "lucide-react"
import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"

export default function DashboardPage() {
  // Use state to hold user data
  const [user, setUser] = useState<any>(null)
  const [activeAuctions, setActiveAuctions] = useState<any[]>([])
  const [myBids, setMyBids] = useState<any[]>([])
  const [notifications, setNotifications] = useState<any[]>([]); // Notifications state
  const [unreadCount, setUnreadCount] = useState(0); // Unread notifications count
  const [hasCelebrated, setHasCelebrated] = useState(false); // Track if the toast was shown
  const [loading, setLoading] = useState<boolean>(true)

  // Function to handle setting the unread count
  const updateUnreadCount = () => {
    setUnreadCount(notifications.filter((notification) => !notification.read).length);
  };

  // Fetch the user data from localStorage on client-side
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user")
      const parsedUser = storedUser ? JSON.parse(storedUser) : null

      if (parsedUser) {
        setUser(parsedUser)

        // Fetch additional user details (user_type, verification_status) from the backend
        fetchDashboardData(parsedUser.username)
      } else {
        window.location.href = "/login" // Redirect if no user data
      }
    }
  }, [])

  const fetchDashboardData = async (username: string) => {
    try {
      const response = await fetch(`https://zecbay-backend.vercel.app/api/dashboard/?username=${username}`);
      const data = await response.json();

      console.log("Dashboard Data:", data.success);
      console.log("User Data:", data.user);

      if (data.success) {
        // Set user data state
        setUser((prevState: any) => ({
          ...prevState,
          ...data.user,
        }));

        // Check user type and set appropriate state for auctions or bids
        if (data.user.user_type === "importer") {
          // Set auctions if user is an importer
          if (data.auctions && data.auctions.length > 0) {
            setActiveAuctions(data.auctions);
            console.log("Active Auctions:", data.auctions);
          } else {
            console.log("No active auctions found for this user.");
            setActiveAuctions([]);  // Ensure activeAuctions is set to an empty array if no auctions exist
          }
        } else if (data.user.user_type === "exporter") {
          // Set bids if user is an exporter
          if (data.bids && data.bids.length > 0) {
            setMyBids(data.bids);
            console.log("My Bids:", data.bids);
          } else {
            console.log("No bids found for this user.");
            setMyBids([]);  // Ensure myBids is set to an empty array if no bids exist
          }
        }

        // Process notifications based on auctions and bids
        generateNotifications(data.auctions || [], data.bids || []);

      } else {
        // Handle cases where there are no auctions or bids but not an error
        if (data.message === "No bids found") {
          console.log("No bids found for this user.");
        } else if (data.message === "No auctions found") {
          console.log("No active auctions found for this user.");
        } else {
          console.error("Failed to fetch dashboard data:", data.message || "Unknown error");
        }
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

   // Handle celebration toast (show once)
   useEffect(() => {
    if (myBids && !hasCelebrated) {
      // Loop over all bids to check if the user won
      myBids.forEach((bid) => {
        if (bid.timeLeft === "Auction ended" && bid.winner_bid_id === bid.id && user.id) {
          // Display celebration toast once when a user wins a bid
          toast.success(`Congratulations! You won the auction for bid ID: ${bid.auctionID}`, {
            duration: 4000,
            position: "top-center",
          });

          setHasCelebrated(true); // Mark that the celebration has been triggered
        }
      });
    }
  }, [myBids, hasCelebrated, user]);

  interface Notification {
    id: string;
    type: "importer" | "exporter";
    message: string;
    auctionId: string;
    read: boolean;
    goToChat: boolean,
  }

  // Function to generate notifications
  const generateNotifications = (auctions: any[], bids: any[]) => {
    const newNotifications: Notification[] = [];

    // Importer-side notifications
    auctions.forEach((auction) => {
      const ended = auction.time_left === "Auction ended";

      if (ended) {
        if (auction.winner_bid) {
          newNotifications.push({
            id: auction.id,
            type: "importer",
            message: `Your auction "${auction.product_name}" has been completed. ${auction.winner_bid.exporter_id} is the winner.`,
            auctionId: auction.id,
            read: false,
            goToChat: true,
          });
        } else if (auction.bid_count === 0) {
          newNotifications.push({
            id: auction.id,
            type: "importer",
            message: `Your auction "${auction.product_name}" has ended with no bids.`,
            auctionId: auction.id,
            read: false,
            goToChat: false,
          });
        }
      } else if (auction.time_left !== "Auction ended") {
        newNotifications.push({
          id: auction.id,
          type: "importer",
          message: `Your auction "${auction.product_name}" is live and accepting bids.`,
          auctionId: auction.id,
          read: false,
          goToChat: false,
        });
      }
    });

    // Exporter-side notifications
  bids.forEach((bid) => {
    const ended = bid.timeLeft === "Auction ended";

    if (ended) {
      if (bid.winner_bid_id === bid.id) {
          newNotifications.push({
            id: bid.auctionID,
            type: "exporter",
            message: `Congratulations! You won the auction "${bid.auctionID}".`,
            auctionId: bid.auctionID,
            read: false,
            goToChat: true,
          });
        } else {
          newNotifications.push({
            id: bid.auctionID,
            type: "exporter",
            message: `The auction "${bid.auctionID}" has been completed.`,
            auctionId: bid.auctionID,
            read: false,
            goToChat: false,
          });
        }
      } else if (bid.timeLeft !== "Auction ended") {
        newNotifications.push({
          id: bid.auctionID,
          type: "exporter",
          message: `You have placed a bid on auction "${bid.auctionID}".`,
          auctionId: bid.auctionID,
          read: false,
          goToChat: false,
        });
      }
    });

    // Update notifications and unread count
    setNotifications(newNotifications);
    updateUnreadCount();
  };

  // Mark a notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
    updateUnreadCount();
  };

  // Timer function to update time_left
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveAuctions((prevAuctions) =>
        prevAuctions.map((auction) => {
          if (auction.time_left !== "Auction ended") {
            return {
              ...auction,
              time_left: calculateTimeLeft(auction.time_left),
            };
          }
          return auction;
        })
      );
  
      setMyBids((prevBids) =>
        prevBids.map((bid) => {
          if (bid.timeLeft !== "Auction ended") {
            return {
              ...bid,
              timeLeft: calculateTimeLeft(bid.timeLeft),
            };
          }
          return bid;
        })
      );
    }, 1000);

    return () => clearInterval(timer); // Cleanup the timer when component unmounts
  }, [activeAuctions, myBids]); // Re-run effect if activeAuctions changes

  const calculateTimeLeft = (timeLeft: string) => {
    if (timeLeft === "Auction ended") return timeLeft;

    const [hours, minutes, seconds] = timeLeft.split(":").map(Number);
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;

    if (totalSeconds > 0) {
      totalSeconds -= 1; // Decrease by 1 second
    }

    const remainingHours = Math.floor(totalSeconds / 3600);
    const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    const formattedTime = `${remainingHours.toString().padStart(2, "0")}:${remainingMinutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;

    return totalSeconds <= 0 ? "Auction ended" : formattedTime;
  };

  // If user is not yet loaded, show a loader
  if (!user) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-50">
        <img src="/loader.svg" alt="Loading..." className="w-24 h-24" />
      </div>
    );
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Bell className="h-5 w-5" />
                  <span className="sr-only">Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {/* Show unread count */}
                {unreadCount > 0 && (
                  <div className="px-4 py-2 text-xs text-muted-foreground">
                    {unreadCount} Unread Notifications
                  </div>
                )}
                {/* Notifications list */}
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                    key={notification.id}
                    onClick={() => {
                      markAsRead(notification.id); // Mark the notification as read

                      // If the notification is about an auction and has a winner
                      if (notification.type === "importer" && notification.message.includes("completed")) {
                        // If auction completed with a winner, open the chat
                        window.location.href = "/chat";
                      } else {
                        // If auction is live or doesn't have a winner, open the auction details
                        window.location.href = `/auctions/${notification.auctionId}`;
                      }
                    }} // Handle notification click
                  >
                    <div className="flex flex-col">
                      <span>{notification.message}</span>
                    </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    <div className="flex flex-col">
                      <span>No active notifications</span>
                    </div>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {user?.verification_status === "pending" && (
        <Card className="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent className="flex items-center gap-4 py-4">
            <ShieldCheck className="h-8 w-8 text-yellow-500" />
            <div className="flex-1">
              <h3 className="font-medium">Your account is being verified</h3>
              <p className="text-sm text-muted-foreground">
                This can take up to 3 business days. You will receive an email once your account is verified.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Account Status Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Account Status</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-semibold text-xl">{user.name}</h3> {/* Slightly larger text */}
            <p className="text-sm text-muted-foreground">{user.email}</p>
            <div className="flex items-center gap-3 mt-1">
              <Badge variant={user.verification_status === "verified" ? "default" : "outline"}>
                {user.verification_status === "verified" ? "Verified" : "Pending"}
              </Badge>
              <Badge variant="outline">
                {user.user_type === "exporter" ? "Indian Exporter" : "Importer"}
              </Badge>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-4">
          <Button variant="outline" className="w-full" asChild>
            <Link href="/profile">
              <User className="mr-2 h-4 w-4" />
              View Profile
            </Link>
          </Button>
        </CardFooter>
      </Card>

      {/* Quick Actions Card */}
        {user?.user_type === "importer" && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
            <Button className="h-auto py-4 flex flex-col items-center justify-center" asChild>
              <Link href="/list-product">
                <span>List Products</span>
              </Link>
            </Button>
            <Button className="h-auto py-4 flex flex-col items-center justify-center" asChild>
              <Link href="/chat">
                <span>Chats</span>
              </Link>
            </Button>
            </CardContent>
          </Card>
        )}

        {/* Chats button for Exporter */}
        {user?.user_type === "exporter" && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-4">
              <Button className="h-auto py-4 flex flex-col items-center justify-center" asChild>
                <Link href="/chat">
                  <span>Chats</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
    </div>

    <Tabs defaultValue="auctions" className="w-full">
      <TabsList className="grid w-full grid-cols-1">
        <TabsTrigger value="auctions">{user.user_type === "importer" ? "My Auctions" : "My Bids"}</TabsTrigger>
      </TabsList>

      {/* Tab Content for Auctions or Bids */}
      <TabsContent value="auctions" className="mt-6">
        {user.user_type === "importer" ? (
          <>
            {/* Nested Tabs for Active and Completed Auctions */}
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              {/* Active Auctions Tab */}
              <TabsContent value="active">
                {activeAuctions.filter((auction) => auction.time_left !== "Auction ended").length > 0 ? (
                  activeAuctions
                    .filter((auction) => auction.time_left !== "Auction ended")
                    .map((auction) => (
                      <Card key={auction.id} className="mb-4">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge variant="outline" className="mb-2">
                                {auction.category} - {auction.subcategory}
                              </Badge>
                              <CardTitle className="text-2xl">{auction.product_name} <span className="text-xl">({auction.variant})</span></CardTitle>
                            </div>
                            <Badge>Active</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Current Price</p>
                              <p className="font-medium">₹{auction.current_price.toFixed(2)}/{auction.unit}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Round</p>
                              <p className="font-medium">{auction.round} of {auction.total_rounds}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Time Left</p>
                              <p className="font-medium">{auction.time_left}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Bids</p>
                              <p className="font-medium">{auction.bid_count}</p>
                            </div>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 mt-4">
                            <div
                              className="bg-primary h-2 rounded-full"
                              style={{ width: `${(auction.round / auction.total_rounds) * 100}%` }}
                            ></div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" className="w-full" asChild>
                            <Link href={`/auctions/${auction.id}`}>View Details</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                ) : (
                  <p className="text-muted-foreground mb-6">No active auctions.</p>
                )}
              </TabsContent>

              {/* Completed Auctions Tab */}
              <TabsContent value="completed">
                {activeAuctions.filter((auction) => auction.time_left === "Auction ended").length > 0 ? (
                  activeAuctions
                    .filter((auction) => auction.time_left === "Auction ended")
                    .map((auction) => (
                      <Card key={auction.id} className="mb-4">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge variant="outline" className="mb-2">
                                {auction.category} - {auction.subcategory}
                              </Badge>
                              <CardTitle className="text-2xl">{auction.product_name} <span className="text-xl">({auction.variant})</span></CardTitle>
                            </div>
                            <Badge>Completed</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Final Price</p>
                              <p className="font-medium">₹{auction.current_price.toFixed(2)}/{auction.unit}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Rounds</p>
                              <p className="font-medium">{auction.total_rounds}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Time Left</p>
                              <p className="font-medium">{auction.time_left}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Bids</p>
                              <p className="font-medium">{auction.bid_count}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" className="w-full" asChild>
                            <Link href={`/auctions/${auction.id}`}>View Details</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                ) : (
                  <p className="text-muted-foreground">No completed auctions.</p>
                )}
              </TabsContent>
            </Tabs>
          </>
        ) : (
          <>
            {/* Nested Tabs for Active and Completed Bids */}
            <Tabs defaultValue="active" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>

              {/* Active Bids Tab */}
              <TabsContent value="active">
                {myBids.filter((bid) => bid.timeLeft !== "Auction ended").length > 0 ? (
                  myBids
                    .filter((bid) => bid.timeLeft !== "Auction ended")
                    .map((bid) => (
                      <Card key={bid.id} className="mb-4">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge variant="outline" className="mb-2">
                                {bid.category} - {bid.subcategory}
                              </Badge>
                              <CardTitle className="text-lg">{bid.auctionID}</CardTitle>
                            </div>
                            <Badge>Active</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 py-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Bid Amount</p>
                              <p className="font-medium">₹{bid.pricePerQuantity.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Time Left</p>
                              <p className="font-medium">{bid.timeLeft}</p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full" asChild>
                            <Link href={`/auctions/${bid.auctionid}`}>View Details</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                ) : (
                  <p className="text-muted-foreground mb-6">No active bids.</p>
                )}
              </TabsContent>

              {/* Completed Bids Tab */}
              <TabsContent value="completed">
                {myBids.filter((bid) => bid.timeLeft === "Auction ended").length > 0 ? (
                  myBids
                    .filter((bid) => bid.timeLeft === "Auction ended")
                    .map((bid) => (
                      <Card key={bid.id} className="mb-4">
                        <CardHeader className="pb-2">
                          <div className="flex items-start justify-between">
                            <div>
                              <Badge variant="outline" className="mb-2">
                                {bid.category} - {bid.subcategory}
                              </Badge>
                              <CardTitle className="text-lg">{bid.auctionID}</CardTitle>
                            </div>
                            <Badge>
                              {bid.winner_bid_id === bid.id ? "Winner" : "Completed"}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 gap-4 py-2">
                            <div>
                              <p className="text-sm text-muted-foreground">Bid Amount</p>
                              <p className="font-medium">₹{bid.pricePerQuantity.toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Result</p>
                              <p className="font-medium">
                                {bid.winner_bid_id === bid.id ? "You won this auction!" : "You did not win"}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button variant="outline" className="w-full" asChild>
                            <Link href={`/auctions/${bid.auctionid}`}>View Details</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))
                ) : (
                  <p className="text-muted-foreground">No completed bids.</p>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </TabsContent>
    </Tabs>
      </div>
    </div>
  )
}
