"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from "next/link"
import { ArrowLeft, User } from "lucide-react"
import { toast, ToastContainer } from 'react-toastify';
// Add `use` from React to unwrap the async params object
import { use } from 'react'

export default function AuctionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const auctionId = use(params).id // Unwrap the Promise here

  const [auctionData, setAuctionData] = useState<any | null>(null)
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [user, setUser] = useState<any>(null)
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [exporterChattingWith, setExporterChattingWith] = useState<string | null>(null)
  const [exporterMessagesSent, setExporterMessagesSent] = useState(0)
  const [isPersonalizedMessage, setIsPersonalizedMessage] = useState(false)
  const [unreadMessages, setUnreadMessages] = useState<Record<string, number>>({});
  const [showPayPopup, setShowPayPopup] = useState(false)
  const [isQuestionsVisible, setIsQuestionsVisible] = useState(true);
  const [showBidSuccess, setShowBidSuccess] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [bidToDelete, setBidToDelete] = useState<any | null>(null);
  const [currentBid, setCurrentBid] = useState<number | null>(null)
  const [editingBid, setEditingBid] = useState<any | null>(null)

  // Predefined questions for the Exporter
  const fixedQuestions = [
    "Can you provide more details on the product?",
    "What are the payment terms?",
    "What is your preferred delivery timeline?",
    "What shipping method do you prefer?",
    "Do you need samples before bulk order?"
  ]; // Array of strings

  // Predefined answers for the Importer
  const fixedAnswers: { [key: string]: string } = {
    "Can you provide more details on the product?": "Sure! Our product is made of high-quality materials, designed to meet your needs.",
    "What are the payment terms?": "We typically offer 30 days payment terms, but we can negotiate depending on the order size.",
    "What is your preferred delivery timeline?": "Our standard delivery time is 7-10 business days, but we can expedite if needed.",
    "What shipping method do you prefer?": "We use reliable couriers like FedEx or DHL, but we can work with any carrier you prefer.",
    "Do you need samples before bulk order?": "Yes, we can provide samples. Please let us know your requirements, and we'll arrange them.",
  };

  // Fetch auction data on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
      const parsedUser = storedUser ? JSON.parse(storedUser) : null

      if (parsedUser) {
        setUser(parsedUser)
      }

    const fetchAuctionData = async () => {
      try {
        const response = await fetch(`https://zecbay-backend.vercel.app/api/auctions/${auctionId}/`)
        if (response.ok) {
          const data = await response.json()
          console.log("Auction Data:", data.auction);
          setAuctionData(data.auction)
          setTimeLeft(data.auction.time_left);
        } else {
          console.error("Failed to fetch auction data:", response.statusText)
        }
      } catch (error) {
        console.error("Error fetching auction data:", error)
      }
    }

    fetchAuctionData()
  }, [auctionId])

  useEffect(() => {
    if (timeLeft !== "Auction ended") {
      // Setup the interval to update time_left every second
      const timer = setInterval(() => {
        setTimeLeft((prevTimeLeft) => calculateTimeLeft(prevTimeLeft)); // Update the time_left continuously
      }, 1000);

      // Cleanup interval on component unmount
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const calculateTimeLeft = (timeLeft: string) => {
    const [hours, minutes, seconds] = timeLeft.split(":").map(Number);
    let totalSeconds = hours * 3600 + minutes * 60 + seconds;

    // Decrease totalSeconds every second
    if (totalSeconds > 0) {
      totalSeconds -= 1;
    }

    const remainingHours = Math.floor(totalSeconds / 3600);
    const remainingMinutes = Math.floor((totalSeconds % 3600) / 60);
    const remainingSeconds = totalSeconds % 60;

    // Format the time as HH:MM:SS
    const formattedTime = `${remainingHours.toString().padStart(2, "0")}:${remainingMinutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;

    // If time is 0, return "Auction ended"
    return totalSeconds <= 0 ? "Auction ended" : formattedTime;
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(`https://zecbay-backend.vercel.app/api/auctions/${auctionId}/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,  // Send current user's username
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);  // Show success message
        setAuctionData((prev: any) => ({
          ...prev,
          registered_users: [...prev.registered_users, user.username],
        }));
      } else {
        toast.error(data.message);  // Already registered or error
      }
    } catch (error) {
      toast.error("Failed to register for the auction.");
      console.error("Registration error:", error);
    }
  };

  // Fetch messages when the user is logged in and auction data is available
  useEffect(() => {
    if (auctionData && user) {
      const fetchMessages = async () => {
        try {
          const response = await fetch(`https://zecbay-backend.vercel.app/api/messages/${auctionId}`)
          if (response.ok) {
            const data = await response.json()
            console.log('Fetched messages:', data);
            setMessages(data.messages)
          } else {
            console.error("Failed to fetch messages:", response.statusText)
          }
        } catch (error) {
          console.error("Error fetching messages:", error)
        }
      }

      fetchMessages()
    }
  }, [auctionData, user])

  // Function to detect personal information (names, phone numbers, emails)
  const containsPersonalInfo = (message: string) => {
  // Regular expressions to match phone numbers, emails, and common name formats
  const namePattern = /\b([A-Z][a-z]+(?:\s[A-Z][a-z]+){0,2})\b/g;
  const phonePattern = /(\+91|91|0)?(\(?\d{2,3}\)?[\s\-]?)?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}\b|\+971\s?\d{1}\d{7}\b/g;
  const emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;

  // Retrieve sender's name from local storage
  const senderName = user.name.trim().toLowerCase();
  const nameParts = senderName.split(' ');

  // Avoid matching common greetings
  const commonPhrases = ['how are you', 'hello', 'hi', 'hey', 'good morning', 'good evening'];
  const lowercasedMessage = message.toLowerCase();

  // Check if the message contains the exact name of the user
  const nameMatches = nameParts.some((part: string) => lowercasedMessage.includes(part));

  if (nameMatches) {
    return true; // Block if any part of the sender's name is found
  }

  // Check if the message contains any common phrase
  if (commonPhrases.some((phrase: string) => lowercasedMessage.includes(phrase))) {
    return false; // If it's a common phrase, return false (no personal info)
  }

  // Check if the message contains personal info (name, phone number, or email)
  return namePattern.test(message) || phonePattern.test(message) || emailPattern.test(message);
  };

  const handleSendMessage = async () => {
    if (!message.trim() || exporterMessagesSent >= 3) return

    try {
      /// Get the Exporter's username from local storage
      const exporterUsername = user.username;
      const receiverUsername = exporterChattingWith || auctionData.created_by;

      // Check for personal information
      if (containsPersonalInfo(message)) {
        alert("Personal information is not allowed.")
        setMessage("") // Reset message input
        return
      }

      if (!exporterUsername || !receiverUsername) {
        console.error("User or Exporter username not found.");
        return;
      }

      // Prepare the data to be sent to the backend
      const dataToSend = {
        auction_id: auctionId,
        sender_username: exporterUsername,
        receiver_username: receiverUsername,
        message: message,
        message_id: Date.now().toString(),
      };

      console.log("Sending data:", dataToSend);

      // Optimistically update UI immediately
      setMessages((prevMessages) => [...prevMessages, dataToSend]);
      setMessage("");
      setExporterMessagesSent((prev) => prev + 1);
      setExporterChattingWith(null); // Optionally reset chat after sending

      // Update unread count if applicable
      if (user.user_type === "importer" && exporterChattingWith) {
        setUnreadMessages((prev) => ({
          ...prev,
          [exporterChattingWith]: (prev[exporterChattingWith] || 0) + 1,
        }));
      }

      // Send the message to the backend API using fetch
      const response = await fetch("https://zecbay-backend.vercel.app/api/messages/send/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({...dataToSend, message_id: undefined,
        }),
      });

      if (!response.ok) {
        console.error("Failed to send message:", response.statusText);
        // Optional: rollback optimistic update
      } else {
        // Optional: refresh messages or replace optimistic message with real one
        const result = await response.json();
        console.log("Message sent, server response:", result);
        window.location.reload();
        // Could also reconcile by replacing temp message with one from server using `message_id`
      }
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleChatWindowOpen = (sender: string) => {
    // Mark messages as read when chat window is opened
    if (user.user_type === "importer") {
      setUnreadMessages((prev) => ({
        ...prev,
        [sender]: 0,
      }));
    }
  };

  // Handle sending a fixed question (from the Exporter)
  const handleFixedQuestion = async (question: string) => {

    const exporterUsername = user.username
    const receiverUsername = auctionData.created_by

    const dataToSend = {
      auction_id: auctionId,
      sender_username: exporterUsername,
      receiver_username: receiverUsername,
      message: question,
      message_id: Date.now().toString(),
    }

    console.log("Sending data:", dataToSend);
  
    // 1. Optimistically update the UI by immediately adding the fixed question
    setMessages((prevMessages) => [
      ...prevMessages,
      { ...dataToSend, message: question },
    ]);
    setExporterMessagesSent((prev) => prev + 1); // Increment message count
  
    // 2. Simulate the Importer's answer (you can get the answer from your fixedAnswers object)
    const importerAnswer = fixedAnswers[question];
    if (importerAnswer) {
      const importerMessage = {
        auction_id: auctionId,
        sender_username: auctionData.created_by,
        receiver_username: exporterUsername,
        message: importerAnswer,
        message_id: Date.now().toString(),
      };
  
      // 3. Optimistically add the Importer's response to the chat (appears instantly in UI)
      setMessages((prevMessages) => [
        ...prevMessages,
        importerMessage,
      ]);
  
      // 4. Send both the question and the Importer's answer to the backend
      try {
        // Sending the fixed question first (sent by Exporter)
        await fetch("https://zecbay-backend.vercel.app/api/messages/send/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...dataToSend, message_id: undefined,
          }),
        });
  
        // Sending the Importer's response (sent by Importer)
        await fetch("https://zecbay-backend.vercel.app/api/messages/send/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({...importerMessage, message_id: undefined,
          }),
        });
  
        console.log("Question and response sent successfully.");
        window.location.reload();
      } catch (error) {
        console.error("Error sending message:", error);
        // Optionally, handle the error (e.g., revert optimistic update if needed)
      }
    }
  };

    const chatWindowRef = useRef<HTMLDivElement | null>(null);

    const handleChatButtonClick = () => {
      // Scroll to the chat window when the button is clicked
      chatWindowRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

  // Handle clicking on "Personalized message"
  const handlePersonalizedMessageClick = () => {
    setIsPersonalizedMessage(true)
  }

  // Function to toggle the visibility of questions
  const toggleQuestionsVisibility = () => {
    setIsQuestionsVisible((prev) => !prev);
  };

  // Handle closing the pay popup
  const handlePayPopupClose = () => {
    setShowPayPopup(false);
  };

  useEffect(() => {
    // Check if exporter messages sent is stored in localStorage or sessionStorage
    const savedMessagesSent = parseInt(localStorage.getItem("exporterMessagesSent") || "0");
    setExporterMessagesSent(savedMessagesSent);
  }, []);

  useEffect(() => {
    // Save exporter messages sent to localStorage to persist across page refresh
    localStorage.setItem("exporterMessagesSent", exporterMessagesSent.toString());
  }, [exporterMessagesSent]);

  if (!auctionData) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-50">
        <img src="/loader.svg" alt="Loading..." className="w-24 h-24" />
      </div>
    )
  }

  const handleBidSuccess = () => {
    setShowBidSuccess(true)
    setEditingBid(null) // Reset the editing state after success
  }

  const handleEditBid = (bid: any) => {
    setEditingBid(bid)
    setCurrentBid(bid.current_price) // Set current bid value for editing
  }

  const handleDeleteBid = async (bidId: string) => {
    try {
      const response = await fetch(`https://zecbay-backend.vercel.app/api/bids/delete/${bidId}/`, {
        method: 'POST',
      })

      if (response.ok) {
        setAuctionData((prevData: any) => ({
          ...prevData,
          bids: prevData.bids.filter((bid: any) => bid.id !== bidId),
        }))
        console.log("Bid deleted successfully")
      } else {
        console.error("Failed to delete bid:", response.statusText)
      }
    } catch (error) {
      console.error("Error deleting bid:", error)
    }
  }

  const isBidExpired = (createdAt: string) => {
    const bidDate = new Date(createdAt); // Parse the string into a Date object

    // Convert UTC to IST by adding 5 hours and 30 minutes to the UTC time
    const istOffset = 5.5 * 60 * 60 * 1000; // 5 hours 30 minutes in milliseconds
    const bidDateInIST = new Date(bidDate.getTime() + istOffset);

    const timePassed = (Date.now() - bidDateInIST.getTime()) / 1000 / 60; // minutes
    return timePassed > 115;
  };

  const handleDeleteClick = (bid: any) => {
    setBidToDelete(bid);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (bidToDelete) {
      await handleDeleteBid(bidToDelete.id);
      setIsDeleteDialogOpen(false);
      setBidToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setBidToDelete(null);
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <Link href="/auctions" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Auctions
        </Link>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{auctionData.product_name}</h1>
              <h1 className="text-xl tracking-tight">({auctionData.variant})</h1>
              <Badge>{auctionData.category} - {auctionData.subcategory}</Badge>
            </div>
            <p className="text-muted-foreground">Auction ID: {auctionData.id}</p>
          </div>
          {user?.user_type === "exporter" && auctionData.registered_users?.includes(user.username) && (
            <Button
              onClick={handleChatButtonClick}
              className="ml-4"
            >
              If any queries chat with us
            </Button>
          )}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Time Remaining</p>
              <p className="text-xl font-bold text-primary">{timeLeft}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Current Round</p>
              <p className="text-xl font-bold">{auctionData.round} of {auctionData.total_rounds}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card>
              {/*<div className="aspect-video bg-muted">
                <img src="/placeholder.svg" alt="Product Image" className="w-full h-full object-cover" />
              </div>*/}
              <CardHeader>
                <CardTitle>Product Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Initial Price</p>
                    <p className="font-medium">₹{auctionData.initial_price.toFixed(2)}/{auctionData.unit}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Current Price</p>
                    <p className="font-medium">
                      ₹
                      {
                        auctionData.bids && auctionData.bids.length > 0
                          ? (auctionData.bids[auctionData.bids.length - 1].price ?? auctionData.current_price).toFixed(2) // Get the latest bid's price
                          : auctionData.current_price?.toFixed(2) // Fallback to current price if no bids
                      }
                      /{auctionData.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Quantity</p>
                    <p className="font-medium">{auctionData.quantity}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Number of Registered Users</p>
                    <p className="font-medium">{auctionData.register_count}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {auctionData.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
            <CardHeader>
              <CardTitle>Seller Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">{auctionData.created_by}</h3>
                  <p className="text-xs text-muted-foreground">Seller</p>
                </div>
              </div>
            </CardContent>
          </Card>
          </div>

          <div className="space-y-8">
          {/* Exporter not registered - Show Register Card */}
          {user && user.user_type === "exporter" && !auctionData.registered_users?.includes(user.username) && auctionData.time_left !== "Auction ended" && (
            <Card>
              <CardHeader>
                <CardTitle>Register for this Auction</CardTitle>
              </CardHeader>
              <CardContent>
                <p>If you want to participate in the auction and place bids, please register now.</p>
                <Button className="mt-4" onClick={handleRegister}>
                  Register Now
                </Button>
              </CardContent>
            </Card>
          )}

          {user && user.user_type === "exporter" && auctionData.time_left !== "Auction ended" && auctionData.registered_users?.includes(user.username) && (
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>{editingBid ? "Edit Your Bid" : "Place Your Bid"}</CardTitle>
                    <CardDescription>
                      Current round: {auctionData.round} of {auctionData.total_rounds} (Ends in {timeLeft})
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BidForm
                      auctionId={auctionId}
                      auctionCurrentPrice={auctionData.current_price}
                      onBidSuccess={handleBidSuccess}
                      editingBid={editingBid}
                      setEditingBid={setEditingBid}
                      auctionData={auctionData}
                    />
                  </CardContent>
                </Card>
              </div>
            )}

          {/* Display existing bids */}
          {auctionData.time_left !== "Auction ended" && (
            (user?.user_type === "exporter" && auctionData.registered_users?.includes(user.username)) ||
            user?.user_type === "importer"
          ) && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Bids</CardTitle>
                  <CardDescription>
                    {auctionData.bids.length === 0 ? "No bids currently" : ""}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {auctionData.bids.length === 0 ? (
                    <p>No bids currently</p>
                  ) : (
                    auctionData.bids
                    .sort((a: any, b: any) => a.price - b.price)
                    .map((bid: any, index: number) => (
                      <div
                        key={bid.id}
                        className={`flex justify-between items-center space-y-4 ${index !== auctionData.bids.length - 1 ? 'mb-4' : ''}`}
                      >
                        <div className="w-full">
                          <p>Exporter: {bid.exporter_id}</p>
                          <p>Bid price: ₹{bid.price}</p>
                        </div>
                        {user?.user_type === "exporter" && String(user.id) === String(bid.exporter_id) && (
                          <div className="flex space-x-4">
                            {/* Edit Button */}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    <Button
                                      onClick={() => handleEditBid(bid)}
                                      disabled={isBidExpired(bid.created_at)}
                                      className={isBidExpired(bid.created_at) ? 'opacity-50 cursor-not-allowed' : ''}
                                    >
                                      Edit
                                    </Button>
                                  </span>
                                </TooltipTrigger>
                                {/* Show tooltip if bid expired */}
                                {isBidExpired(bid.created_at) && (
                                  <TooltipContent>
                                    Bid Locked (5 mins passed)
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>

                            {/* Delete Button */}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span>
                                    <Button
                                      onClick={() => handleDeleteClick(bid)}
                                      variant="destructive"
                                      disabled={isBidExpired(bid.created_at)}
                                      className={isBidExpired(bid.created_at) ? 'opacity-50 cursor-not-allowed' : ''}
                                    >
                                      Delete
                                    </Button>
                                  </span>
                                </TooltipTrigger>
                                {/* Show tooltip if bid expired */}
                                {isBidExpired(bid.created_at) && (
                                  <TooltipContent>
                                    Bid Locked (5 mins passed)
                                  </TooltipContent>
                                )}
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {isDeleteDialogOpen && bidToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
                <p className="text-lg font-medium mb-4">
                  Are you sure you want to delete this bid?
                </p>
                <div className="flex justify-end gap-2">
                  <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800" onClick={cancelDelete}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmDelete}>
                    Yes, Delete
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Winner Bid Card - Show only if the auction has ended */}
          {auctionData.time_left === "Auction ended" && auctionData.winner && (
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Winner Bid</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Exporter ID: {auctionData.winner.exporter_id}</p>
                  <p>Bid Price: ₹{auctionData.winner.price}</p>
                </CardContent>
              </Card>
            </div>
          )}

            <Dialog open={showBidSuccess} onOpenChange={setShowBidSuccess}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bid Successful</DialogTitle>
                </DialogHeader>
                <DialogDescription>Your bid has been placed successfully!</DialogDescription>
                <DialogFooter>
                <Button 
                  onClick={() => {
                    setShowBidSuccess(false);
                    window.location.reload(); // Reload the page to get the updated bids
                  }}
                >
                  OK
                </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="lg:col-span-2 space-y-8">
          {/* Chat Interface for Importers */}
            {user?.user_type === "importer" && (
              <div className="space-y-8">
                {/* Messages List for Importer */}
                <div className="w-full p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-4">Messages</h3>
                  <ul>
                    {messages.length > 0 ? (
                      messages
                        .filter((message) => message.sender !== user.username) // Exclude your own username
                        .reduce((uniqueSenders: string[], message) => {
                          // Step 2: If the sender is not already in the list, add to uniqueSenders
                          if (!uniqueSenders.includes(message.sender)) {
                            uniqueSenders.push(message.sender);
                          }
                          return uniqueSenders;
                        }, [])
                        .map((sender) => (
                          <li key={sender}>
                            <button
                              className="text-primary"
                              onClick={() => {
                                setExporterChattingWith(sender);
                                handleChatWindowOpen(sender);
                              }}
                            >
                              <div className="flex items-center justify-between w-full">
                                <span className="text-left">{sender}</span>
                                {unreadMessages[sender] > 0 && (
                                  <span className="ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                                    {unreadMessages[sender]}
                                  </span>
                                )}
                              </div>
                            </button>
                          </li>
                        ))
                    ) : (
                      <li key="no-messages">No messages available</li>
                    )}
                  </ul>
                </div>
                <Separator />
                {/* Chat Window for Selected Exporter */}
                {exporterChattingWith && (
                  <Card className="w-full max-w-screen-lg">
                    <CardHeader className="bg-gray-100 px-4 py-2 rounded-t-lg">
                      <div className="text-sm text-muted-foreground">Chatting with</div>
                      <CardTitle className="text-lg font-semibold">{exporterChattingWith}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="h-64 overflow-y-auto border-b pb-4">
                        {messages
                          .filter(
                            (msg) => {
                              if (!user?.username || !exporterChattingWith) return false;
                              const isSender = msg.sender === exporterChattingWith && msg.receiver === user.username;
                              const isReceiver = msg.receiver === exporterChattingWith && msg.sender === user.username;
                              return isSender || isReceiver;
                            })
                          .map((msg) => (
                            <div
                              key={`${auctionData.id}-${msg.message_id}`}
                              className={`flex ${msg.sender === user.username ? "justify-end" : "justify-start"} mb-2`}
                            >
                              <div
                                className={`max-w-xs p-3 rounded-lg text-white ${
                                  msg.sender === user.username ? "bg-primary" : "bg-gray-300 text-gray-900"
                                }`}
                              >
                                {msg.message}
                              </div>
                            </div>
                          ))}
                      </div>
                      <Input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="mt-2"
                      />
                      <Button onClick={handleSendMessage} className="mt-2">
                        Send Message
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Exporter View for Messages */}
            {user?.user_type === "exporter" && auctionData.registered_users?.includes(user.username) && (
              <div className="space-y-8">
                {/* Display the importer's messages */}
                <Card className="w-full max-w-screen-lg">
                <CardHeader className="bg-gray-100 px-4 py-2 rounded-t-lg">
                  <div className="text-sm text-muted-foreground">Chatting with</div>
                  <CardTitle className="text-lg font-semibold">{auctionData?.created_by}</CardTitle>
                </CardHeader>
                  <CardContent className="space-y-4">
                    <div ref={chatWindowRef} className="h-64 overflow-y-auto border-b pb-4">
                      {messages
                        .filter(
                          (msg) => {
                            if (!user?.username || !auctionData?.created_by) return false;
                            const isSender = msg.sender === user.username && msg.receiver === auctionData.created_by;
                            const isReceiver = msg.receiver === user.username && msg.sender === auctionData.created_by;
                            return isSender || isReceiver;
                          })
                        .map((msg) => (
                          <div
                            key={`${auctionData.id}-${msg.message_id}`}
                            className={`flex ${msg.sender === user.username ? "justify-end" : "justify-start"} mb-2`}
                          >
                            <div
                              className={`max-w-xs p-3 rounded-lg text-white ${
                                msg.sender === user.username ? "bg-secondary" : "bg-primary text-gray-900"
                              }`}
                            >
                              {msg.message}
                            </div>
                          </div>
                        ))}
                    </div>
                    <div>
                      {/* Show Fixed Questions and Personalized Message inputs independently */}
                      <div>
                        {/* Toggle visibility of fixed questions */}
                        <Button
                          onClick={toggleQuestionsVisibility}
                          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 mb-2 rounded-md flex items-center"
                        >
                          <span
                            className={`mr-2 ${isQuestionsVisible ? 'rotate-180' : ''}`} // Rotate arrow when visible
                            style={{
                              display: 'inline-block',
                              width: '0px',
                              height: '0px',
                              borderLeft: '5px solid transparent',
                              borderRight: '5px solid transparent',
                              borderTop: '5px solid #000',
                              transition: 'transform 0.3s', // Smooth transition
                            }}
                          ></span>
                          {isQuestionsVisible ? "Hide Questions" : "Show Questions"}
                        </Button>
                        {/* Show fixed questions if `isQuestionsVisible` is true */}
                        {isQuestionsVisible && (
                          <div>
                            {fixedQuestions.map((question, index) => (
                              <Button
                                key={index}
                                onClick={() => handleFixedQuestion(question)}
                                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 mb-2 rounded-md"
                              >
                                {question}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Button for personalized message */}
                      <Button
                        onClick={() => setIsPersonalizedMessage(!isPersonalizedMessage)}  // Toggle visibility of personalized message
                        className="mt-4 w-full"
                      >
                        {isPersonalizedMessage ? "Close" : "Personalized message"}
                      </Button>

                      {/* Personalized message area */}
                      {isPersonalizedMessage && (
                        <div className="mt-4">
                          <Input
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Type your personalized message..."
                            className="mt-2"
                          />
                          <Button onClick={handleSendMessage} className="mt-2" disabled={exporterMessagesSent >= 3}>
                            Send Message
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
        </div>
      </div>
      </div>
      {/* Popup for message payment */}
      {exporterMessagesSent >= 3 && !showPayPopup && (
        <Dialog open={showPayPopup} onOpenChange={(isOpen) => setShowPayPopup(isOpen)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Pay for more messages</DialogTitle>
            </DialogHeader>
            <DialogDescription>
              You have reached the limit for sending personalized messages. Please make a payment to send more.
            </DialogDescription>
            <DialogFooter>
              <Button variant="outline" onClick={handlePayPopupClose}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <ToastContainer />
    </div>
  )
}

interface BidFormProps {
  auctionId: string
  auctionCurrentPrice: number; // Current price of the auction
  onBidSuccess: () => void
  editingBid: any | null
  setEditingBid: React.Dispatch<React.SetStateAction<any | null>>
  auctionData: any
}

const BidForm = ({
  auctionId,
  auctionCurrentPrice,
  onBidSuccess,
  editingBid,
  setEditingBid,
  auctionData,
}: BidFormProps) => {
  const [pricePerQuantity, setPricePerQuantity] = useState<number | string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastBidder, setLastBidder] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [actionType, setActionType] = useState<"create" | "edit" | "delete" | null>(null);
  const [bidTimestamp, setBidTimestamp] = useState<number | null>(null);
  const [isBidExpired, setIsBidExpired] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const user = storedUser ? JSON.parse(storedUser) : null;
    if (user?.id) {
      setCurrentUserId(String(user.id));
    }

    // Get the last bid from the auction data and check if it's made by the current user
    if (auctionData.bids.length > 0) {
      const lastBid = auctionData.bids[auctionData.bids.length - 1];
      setLastBidder(String(lastBid.exporter_id));
      setBidTimestamp(Number(lastBid.created_at));
    }
  }, [auctionData.bids]);

  useEffect(() => {
    if (bidTimestamp) {
      const interval = setInterval(() => {
        const timePassed = (Date.now() - bidTimestamp) / 1000 / 60; // minutes
        if (timePassed > 5) {
          setIsBidExpired(true);
          clearInterval(interval); // Stop checking after expiration
        }
      }, 1000); // Check every second or minute

      return () => clearInterval(interval);
    }
  }, [bidTimestamp]);

  const isLastBidder = lastBidder && currentUserId && lastBidder === currentUserId;
  const isCreatingBid = !editingBid;

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();

    // Trigger confirmation dialog
    const action = editingBid ? "edit" : "create";
    setActionType(action);
    setIsConfirmDialogOpen(true);
  };

  const submitBid = async () => {
    if (isSubmitting || !pricePerQuantity) return;

    // Validate Price constraints
    if (Number(pricePerQuantity) >= auctionCurrentPrice) {
      setError(`Bid price per quantity must be less than the current auction price (${auctionCurrentPrice}).`);
      return;
    }

    if (Number(pricePerQuantity) <= 0) {
      setError("Bid must be greater than 0.");
      return;
    }

    // Prevent bid if the last bidder is the current user
    if (isCreatingBid && isLastBidder) {
      setError("You cannot place a bid until another user places a bid.");
      return;
    }

    setIsSubmitting(true);
    setError(null); // Clear any previous error
    try {

      const bidData = {
        auction_id: auctionId,
        exporter_id: currentUserId,
        price_per_quantity: Number(pricePerQuantity),
      };

      const url = editingBid
        ? `https://zecbay-backend.vercel.app/api/bids/update/${editingBid.id}/`
        : "https://zecbay-backend.vercel.app/api/bids/create/";

      const response = await fetch(url, {
        method: "POST",
        body: JSON.stringify(bidData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log(bidData);

      if (response.ok) {
        const newBid = await response.json(); // assuming backend returns the created bid

        onBidSuccess(); // Trigger parent to maybe refetch or re-render

        // Clear form state
        setPricePerQuantity("");
        setEditingBid(null);
        setIsConfirmDialogOpen(false);
      } else {
        console.error("Bid failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error placing bid:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (value === "") {
      setPricePerQuantity("");
      setError(null); // Let user clear input without showing error
      return;
    }

    // Check if the value has more than 2 decimal places
    const regex = /^\d+(\.\d{0,2})?$/;

    // If the value matches the regex, it's a valid input, so update the state
    if (regex.test(value)) {
      setPricePerQuantity(value);
      setError(""); // Clear any error message
    } else {
      setError("Only two decimal places allowed.");
    }
  };

  const confirmAction = async () => {
    if (actionType === "create" || actionType === "edit") {
      await submitBid();
    }
  };

  return (
    <form onSubmit={handleBid}>
      <div className="space-y-4">
        {error && <p className="text-red-500">{error}</p>} {/* Display error message */}

        <div>
          <Label htmlFor="pricePerQuantity">Price Per Quantity</Label>
          <Input
            type="number"
            id="pricePerQuantity"
            value={pricePerQuantity}
            onChange={handlePriceChange}
            step="0.01" // Allows up to 2 decimal places
            placeholder={`Current Auction Price: ₹${auctionCurrentPrice}`}
            min={0}
          />
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting || !pricePerQuantity || (isCreatingBid && isLastBidder) === true || isBidExpired}
                >
                  {isSubmitting ? "Placing Bid..." : editingBid ? "Update Bid" : "Place Bid"}
                </Button>
              </div>
            </TooltipTrigger>
            {isCreatingBid && isLastBidder && (
              <TooltipContent>
                You cannot place consecutive bids. Wait for another exporter to bid.
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
      {/* Confirmation Dialog */}
        {isConfirmDialogOpen && (
          <div className="confirm-dialog">
            <div className="dialog-content bg-white p-4 rounded shadow">
              <p className="mb-4">Are you sure you want to {actionType} this bid?</p>
              <div className="flex gap-2 justify-end">
                <Button onClick={confirmAction}>
                  Yes
                </Button>
                <Button className="bg-gray-200 hover:bg-gray-300 text-gray-800" onClick={() => setIsConfirmDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
    </form>
  );
};
