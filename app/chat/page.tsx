"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Filter, Info, X } from "react-feather"

interface AuctionData {
  id: string
  product_name: string
  created_by: string
  winner_bid: {
    exporter_id: string
    price: number
    id: string
    created_at: string
  } | null
  importer_details: User
  exporter_details: User
}

interface Message {
  message_id: string
  sender: string
  receiver: string
  message: string
  timestamp: string
}

interface User {
  id?: number
  username: string
  full_name: string
  email: string;
  phone_number: string;
  iec: string; // Importer Exporter Code
  role: "importer" | "exporter"
}

export default function ChatInterface() {
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [search, setSearch] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [filterAuctionsOnly, setFilterAuctionsOnly] = useState(false)
  const [selectedAuction, setSelectedAuction] = useState<string>('')
  const [auctionList, setAuctionList] = useState<AuctionData[]>([])
  const [auctionId, setAuctionId] = useState<string | null>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [auction, setAuction] = useState<AuctionData | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [receiverUsername, setReceiverUsername] = useState('')
  const [selectedAuctionPerUser, setSelectedAuctionPerUser] = useState<{ [username: string]: string }>({})
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [showUserDetails, setShowUserDetails] = useState(false)

  // Load current user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setCurrentUser({
          id: parsedUser.id,
          username: parsedUser.username,
          full_name: parsedUser.name,
          email: parsedUser.email,
          phone_number: parsedUser.phone,
          iec: parsedUser.iec,
          role: parsedUser.user_type === "importer" ? "importer" : "exporter",
        })
      }
    }, [])

  // Fetch auction data and derive user relationships
  useEffect(() => {
    const fetchAuctions = async () => {
      if (!currentUser) return;
  
      setLoading(true)
      try {
        const res = await axios.get("https://zecbay-backend.vercel.app/api/auctions_message/")
        const auctions = res.data.completed_auctions
  
        console.log("Fetched auctions from backend:", auctions)
        console.log("Current user:", currentUser)
  
        const relevantAuctions =
          currentUser.role === "importer"
            ? auctions.filter((a: AuctionData) => a.created_by === currentUser.username)
            : auctions.filter((a: AuctionData) => a.winner_bid?.exporter_id === String(currentUser.id))

        setAuctionList(relevantAuctions)

        const usersMap: { [username: string]: User } = {}
        const auctionPerUser: { [username: string]: string } = {}

        for (let a of relevantAuctions) {
            const otherUser =
              currentUser.role === "importer" ? a.exporter_details : a.importer_details

            // Skip if otherUser is null or doesn't have a username
            if (!otherUser || !otherUser.username) {
              console.warn("Skipping auction with missing user details:", a)
              continue
            }

            usersMap[otherUser.username] = otherUser

            if (!auctionPerUser[otherUser.username]) {
              auctionPerUser[otherUser.username] = a.id
            }
          }

        setUsers(Object.values(usersMap))
        setSelectedAuctionPerUser(auctionPerUser)
        setAuctionId(Object.values(auctionPerUser)[0] || null)

      } catch (err) {
        console.error("Error fetching auctions:", err)
        setError("Failed to load auctions")
      } finally {
        setLoading(false)
      }
    }

    fetchAuctions()
  }, [currentUser])

  // Set receiver & auction
  useEffect(() => {
    if (!auctionId || !auctionList.length || !currentUser) return
    const foundAuction = auctionList.find((a) => a.id === auctionId)
    if (!foundAuction) return

    setAuction(foundAuction)

    if (currentUser.role === "importer") {
        // Safely resolve the username from exporter_details based on the ID
        const exporterId = foundAuction.winner_bid?.exporter_id
        if (exporterId && foundAuction.exporter_details && String(foundAuction.exporter_details.id) === String(exporterId)) {
          setReceiverUsername(foundAuction.exporter_details.username)
        }
      } else {
        setReceiverUsername(foundAuction.created_by)
      }
  }, [auctionId, auctionList, currentUser])

  // Fetch messages for auction
  useEffect(() => {
    const fetchMessages = async () => {
      if (!auctionId) return
      try {
        const res = await axios.get(`https://zecbay-backend.vercel.app/api/messages/${auctionId}/`)
        setMessages(res.data.messages)
      } catch (err) {
        console.error("Error fetching messages:", err)
      }
    }

    if (auctionId) {
      fetchMessages()
      const interval = setInterval(fetchMessages, 3000)
      return () => clearInterval(interval)
    }
  }, [auctionId])

  const sendMessage = async () => {
    if (!newMessage.trim() || !receiverUsername || !currentUser) return
    try {
      const res = await axios.post("https://zecbay-backend.vercel.app/api/messages/send/", {
        auction_id: auctionId,
        sender_username: currentUser.username,
        receiver_username: receiverUsername,
        message: newMessage,
      })

      const msg = res.data.message
      setMessages((prev) => [
        ...prev,
        {
          message_id: Date.now().toString(),
          sender: msg.sender,
          receiver: msg.receiver,
          message: msg.message,
          timestamp: msg.timestamp,
        },
      ])
      setNewMessage("")
    } catch (err) {
      console.error("Failed to send message", err)
    }
  }

  const handleUserSelectAuction = (username: string, auctionId: string) => {
    setSelectedAuctionPerUser((prev) => ({ ...prev, [username]: auctionId }))
    setAuctionId(auctionId)
    const user = users.find((u) => u.username === username)
    if (user) setSelectedUser(user)
  }

  const filteredMessages = messages.filter(
    (msg) =>
      (msg.sender === currentUser?.username && msg.receiver === receiverUsername) ||
      (msg.receiver === currentUser?.username && msg.sender === receiverUsername)
  )

  const handleUserClick = (user: User) => {
    setSelectedUser(user)
    const auctionWithUser = auctionList.find((a) =>
      currentUser?.role === "exporter"
        ? a.importer_details.username === user.username
        : a.exporter_details.username === user.username
    )
    if (auctionWithUser) {
      setAuctionId(auctionWithUser.id)
    }
  }

  const handleBack = () => setSelectedUser(null)

  const handleAuctionSelect = (id: string | null) => {
    setAuctionId(id || null)
    setSelectedUser(null)
    setIsDropdownOpen(false)
    setFilterAuctionsOnly(false)
  }

  if (loading) {
    return (
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-background bg-opacity-100">
        <img src="/loader.svg" alt="Loading..." className="w-24 h-24" />
      </div>
    )
  }

  const otherUserDetails =
    currentUser?.role === "exporter"
      ? auction?.importer_details
      : auction?.exporter_details

      return (
        <div className="flex min-h-screen items-center justify-center p-4">
          <div className="w-full max-w-[1300px] h-[90vh] shadow-xl rounded-lg flex overflow-hidden relative">
            {/* Sidebar */}
            <div className={`w-1/3 border-r flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 flex justify-between items-center">
                <h1 className="text-xl font-bold text-secondary">ZecBay Chat</h1>
              </div>
              <div className="px-4 pb-2">
                <input
                  type="text"
                  placeholder="Search contacts"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-background px-3 py-2 border rounded-md text-sm"
                />
              </div>
              <div className="flex-1 overflow-y-auto">
                {users
                  .filter((user) => user.full_name.toLowerCase().includes(search.toLowerCase()))
                  .map((user) => {
                    const auctions = auctionList.filter((a) =>
                      currentUser?.role === "exporter"
                        ? a.importer_details?.username === user.username
                        : a.exporter_details?.username === user.username
                    )
    
                    const selectedAuctionId = selectedAuctionPerUser[user.username]
                    const selectedAuction = auctions.find((a) => a.id === selectedAuctionId)
    
                    return (
                      <div key={user.username} className="px-4 py-3 border-b">
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={() => {
                            setSelectedUser(user)
                            setAuctionId(selectedAuctionId)
                          }}
                        >
                          <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-md font-bold">
                            {user.full_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="text-lg font-bold">{user.full_name}</div>
                            <select
                              className="text-sm mt-1 px-2 py-1 rounded-xl bg-secondary/90 text-white w-full"
                              value={selectedAuctionId}
                              onChange={(e) => handleUserSelectAuction(user.username, e.target.value)}
                            >
                              {auctions.map((a) => (
                                <option className="bg-background text-black" key={a.id} value={a.id}>
                                  {a.product_name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
    
            {/* Chat Window */}
            <div className="flex-1 flex flex-col">
              {selectedUser ? (
                <>
                  <div className="border-b px-4 py-3 flex justify-between items-center bg-background">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-md font-medium">
                        {selectedUser.full_name.charAt(0).toUpperCase()}
                      </div>
                      <h3 className="text-lg font-bold">{selectedUser.full_name}</h3>
                    </div>
                    <button onClick={() => setShowUserDetails(true)} className="text-gray-600 hover:text-primary">
                      <Info size={18} />
                    </button>
                  </div>
                  <div className="flex-1 p-4 overflow-y-auto space-y-2">
                    {filteredMessages.map((msg) => (
                      <div
                        key={msg.message_id}
                        className={`max-w-[70%] p-2 rounded-md text-sm ${
                          msg.sender === currentUser?.username
                            ? 'bg-blue-500 text-white self-end ml-auto'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {msg.message}
                      </div>
                    ))}
                  </div>
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 border bg-background rounded-md px-3 py-2 text-sm"
                        placeholder="Type your message..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                      />
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600"
                        onClick={sendMessage}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <h2 className="text-2xl font-semibold mb-2 text-[#253187]">Welcome to ZecBay Chat</h2>
                    <p>Select a conversation to start chatting</p>
                  </div>
                </div>
              )}
            </div>
    
            {/* User Details Panel */}
            {showUserDetails && otherUserDetails && (
              <div className="absolute top-0 right-0 w-full sm:w-[350px] h-full bg-background shadow-lg z-50 transition-all border-l">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-lg font-semibold">Profile</h2>
                  <button onClick={() => setShowUserDetails(false)}>
                    <X />
                  </button>
                </div>
                <div className="p-6 flex flex-col items-center text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center text-2xl font-semibold">
                    {otherUserDetails.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-lg font-bold">{otherUserDetails.full_name}</p>
                    <p className="text-sm text-muted-foreground">@{otherUserDetails.username}</p>
                  </div>
                </div>
                <div className="px-6 pt-4 border-t">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Contact Information</h3>
                  <p className="text-sm text-gray-600"><strong>Email:</strong> {otherUserDetails.email}</p>
                  <p className="text-sm text-gray-600 mt-1 mb-2"><strong>Phone:</strong> {otherUserDetails.phone_number}</p>
                </div>
                <div className="px-6 pt-4 border-t">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Business Information</h3>
                  <p className="text-sm text-gray-600 mt-1"><strong>IEC:</strong> {otherUserDetails.iec}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )
    }
