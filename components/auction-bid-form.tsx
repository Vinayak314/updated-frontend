"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"

interface AuctionBidFormProps {
  currentPrice: number
  ticketSizes: number[]
  initialPrice: number
}

export function AuctionBidForm({ currentPrice, ticketSizes, initialPrice }: AuctionBidFormProps) {
  const [selectedTicketSize, setSelectedTicketSize] = useState<number>(ticketSizes[0])
  const [quantity, setQuantity] = useState<number>(100) // Default MOQ
  const [newPrice, setNewPrice] = useState<number>(0)
  const [totalValue, setTotalValue] = useState<number>(0)

  // Calculate the new price based on the ticket size
  useEffect(() => {
    // New Price = (Initial Price) × (0.2) × (Ticket Size) + Initial Price
    const calculatedPrice = initialPrice * 0.2 * selectedTicketSize + initialPrice
    setNewPrice(Number.parseFloat(calculatedPrice.toFixed(2)))

    // Calculate total value
    setTotalValue(Number.parseFloat((calculatedPrice * quantity).toFixed(2)))
  }, [selectedTicketSize, quantity, initialPrice])

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value) && value > 0) {
      setQuantity(value)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the bid to your backend
    alert(`Bid placed: ${quantity} kg at $${newPrice}/kg (Total: $${totalValue})`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label>Current Price</Label>
        <div className="text-2xl font-bold">${currentPrice.toFixed(2)}/kg</div>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="ticket-size">Select Ticket Size</Label>
        <RadioGroup
          defaultValue={selectedTicketSize.toString()}
          onValueChange={(value) => setSelectedTicketSize(Number.parseInt(value))}
          className="grid grid-cols-5 gap-2"
        >
          {ticketSizes.map((size) => (
            <div key={size} className="flex items-center space-x-2">
              <RadioGroupItem value={size.toString()} id={`ticket-${size}`} className="peer sr-only" />
              <Label
                htmlFor={`ticket-${size}`}
                className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
              >
                {size}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <p className="text-sm text-muted-foreground">
          Higher ticket size increases your bid amount but improves chances of winning.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Quantity (kg)</Label>
        <Input id="quantity" type="number" min="100" step="10" value={quantity} onChange={handleQuantityChange} />
        <p className="text-sm text-muted-foreground">Minimum order quantity: 100 kg</p>
      </div>

      <Separator />

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Your Bid Price</Label>
          <span className="text-lg font-bold">${newPrice.toFixed(2)}/kg</span>
        </div>
        <div className="flex justify-between">
          <Label>Total Value</Label>
          <span className="text-lg font-bold">${totalValue.toFixed(2)}</span>
        </div>
      </div>

      <Button type="submit" className="w-full">
        Place Bid
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        By placing a bid, you agree to the auction terms and conditions. If you win, you will be required to complete
        the purchase.
      </p>
    </form>
  )
}

