import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function OrdersPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="flex items-center gap-2 font-bold text-2xl text-primary">
            <Icons.auction className="h-6 w-6" />
            <span>ZecBay</span>
          </div>
          <MainNav className="mx-6" />
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-10">
        <div className="flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
              <p className="text-muted-foreground">Manage and track your orders</p>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Search orders..." className="w-[250px]" />
              <Select defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending Payment</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="buyer" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="buyer">As Buyer</TabsTrigger>
              <TabsTrigger value="seller">As Seller</TabsTrigger>
            </TabsList>
            <TabsContent value="buyer" className="mt-6">
              <div className="grid gap-6">
                {[
                  {
                    id: "ORD-2025-1234",
                    product: "Premium Cotton Textiles",
                    seller: "Textile Exports Ltd.",
                    date: "June 20, 2025",
                    amount: "$14,750.00",
                    status: "processing",
                    paymentStatus: "paid",
                    shippingStatus: "preparing",
                  },
                  {
                    id: "ORD-2025-1189",
                    product: "Handcrafted Jewelry Set",
                    seller: "Artisan Crafts India",
                    date: "June 15, 2025",
                    amount: "$8,250.00",
                    status: "shipped",
                    paymentStatus: "paid",
                    shippingStatus: "in-transit",
                  },
                  {
                    id: "ORD-2025-1023",
                    product: "Organic Spices Collection",
                    seller: "Spice Garden Exports",
                    date: "June 5, 2025",
                    amount: "$4,500.00",
                    status: "delivered",
                    paymentStatus: "paid",
                    shippingStatus: "delivered",
                  },
                ].map((order, index) => (
                  <OrderCard
                    key={index}
                    id={order.id}
                    product={order.product}
                    counterparty={order.seller}
                    date={order.date}
                    amount={order.amount}
                    status={order.status}
                    paymentStatus={order.paymentStatus}
                    shippingStatus={order.shippingStatus}
                    role="buyer"
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="seller" className="mt-6">
              <div className="grid gap-6">
                {[
                  {
                    id: "ORD-2025-1245",
                    product: "Premium Cotton Textiles",
                    buyer: "Dubai Imports LLC",
                    date: "June 22, 2025",
                    amount: "$22,125.00",
                    status: "pending",
                    paymentStatus: "awaiting",
                    shippingStatus: "not-started",
                  },
                  {
                    id: "ORD-2025-1201",
                    product: "Handcrafted Wooden Decor",
                    buyer: "Al Madina Interiors",
                    date: "June 18, 2025",
                    amount: "$12,800.00",
                    status: "processing",
                    paymentStatus: "paid",
                    shippingStatus: "preparing",
                  },
                  {
                    id: "ORD-2025-1156",
                    product: "Leather Accessories Collection",
                    buyer: "Emirates Retail Group",
                    date: "June 12, 2025",
                    amount: "$9,650.00",
                    status: "shipped",
                    paymentStatus: "paid",
                    shippingStatus: "in-transit",
                  },
                ].map((order, index) => (
                  <OrderCard
                    key={index}
                    id={order.id}
                    product={order.product}
                    counterparty={order.buyer}
                    date={order.date}
                    amount={order.amount}
                    status={order.status}
                    paymentStatus={order.paymentStatus}
                    shippingStatus={order.shippingStatus}
                    role="seller"
                  />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="w-full border-t bg-background py-6">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 ZecBay. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:underline">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

interface OrderCardProps {
  id: string
  product: string
  counterparty: string
  date: string
  amount: string
  status: "pending" | "processing" | "shipped" | "delivered" | "completed"
  paymentStatus: "awaiting" | "paid" | "released"
  shippingStatus: "not-started" | "preparing" | "in-transit" | "delivered"
  role: "buyer" | "seller"
}

function OrderCard({
  id,
  product,
  counterparty,
  date,
  amount,
  status,
  paymentStatus,
  shippingStatus,
  role,
}: OrderCardProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{product}</CardTitle>
            <CardDescription className="mt-1">
              {role === "buyer" ? "Seller" : "Buyer"}: {counterparty} • Order Date: {date}
            </CardDescription>
          </div>
          <Badge
            variant={
              status === "pending"
                ? "outline"
                : status === "processing"
                  ? "secondary"
                  : status === "shipped"
                    ? "default"
                    : "outline"
            }
          >
            {status === "pending"
              ? "Pending"
              : status === "processing"
                ? "Processing"
                : status === "shipped"
                  ? "Shipped"
                  : status === "delivered"
                    ? "Delivered"
                    : "Completed"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-2">
          <div>
            <p className="text-sm text-muted-foreground">Order ID</p>
            <p className="font-medium">{id}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="font-medium">{amount}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Payment</p>
            <Badge variant="outline" className="mt-1">
              {paymentStatus === "awaiting"
                ? "Awaiting Payment"
                : paymentStatus === "paid"
                  ? "Paid (In Escrow)"
                  : "Released"}
            </Badge>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Shipping</p>
            <Badge variant="outline" className="mt-1">
              {shippingStatus === "not-started"
                ? "Not Started"
                : shippingStatus === "preparing"
                  ? "Preparing"
                  : shippingStatus === "in-transit"
                    ? "In Transit"
                    : "Delivered"}
            </Badge>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">View Details</Button>
        {role === "buyer" && status === "delivered" && <Button>Confirm Receipt</Button>}
        {role === "seller" && status === "processing" && <Button>Ship Order</Button>}
        {role === "buyer" && status === "pending" && <Button>Make Payment</Button>}
        {(status === "shipped" || status === "in-transit") && <Button variant="secondary">Track Shipment</Button>}
      </CardFooter>
    </Card>
  )
}

