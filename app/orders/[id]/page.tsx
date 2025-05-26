import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the order details based on the ID
  const orderId = params.id

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
          <div>
            <Link href="/orders" className="text-primary hover:underline flex items-center mb-4">
              <Icons.chevronLeft className="mr-1 h-4 w-4" />
              Back to Orders
            </Link>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">Order Details</h1>
                  <Badge>Processing</Badge>
                </div>
                <p className="text-muted-foreground">Order ID: {orderId} • June 20, 2025</p>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline">Download Invoice</Button>
                <Button>Contact Support</Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Order Progress</span>
                        <span className="font-medium">Processing</span>
                      </div>
                      <Progress value={40} className="h-2" />
                    </div>

                    <div className="relative">
                      <div className="absolute left-3 top-0 bottom-0 w-0.5 bg-muted" />

                      <div className="relative pl-8 pb-8">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Icons.check className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">Order Placed</h3>
                          <p className="text-sm text-muted-foreground">June 20, 2025 at 10:30 AM</p>
                          <p className="text-sm mt-1">Your order has been placed successfully.</p>
                        </div>
                      </div>

                      <div className="relative pl-8 pb-8">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Icons.check className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <h3 className="font-medium">Payment Completed</h3>
                          <p className="text-sm text-muted-foreground">June 20, 2025 at 10:35 AM</p>
                          <p className="text-sm mt-1">Payment of $14,750.00 has been processed and held in escrow.</p>
                        </div>
                      </div>

                      <div className="relative pl-8 pb-8">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                          <span className="h-3 w-3 text-primary text-xs">3</span>
                        </div>
                        <div>
                          <h3 className="font-medium">Processing Order</h3>
                          <p className="text-sm text-muted-foreground">Estimated: June 25, 2025</p>
                          <p className="text-sm mt-1">Seller is preparing your order for shipment.</p>
                        </div>
                      </div>

                      <div className="relative pl-8 pb-8">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <span className="h-3 w-3 text-muted-foreground text-xs">4</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-muted-foreground">Shipped</h3>
                          <p className="text-sm text-muted-foreground">Estimated: July 5, 2025</p>
                        </div>
                      </div>

                      <div className="relative pl-8">
                        <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-muted flex items-center justify-center">
                          <span className="h-3 w-3 text-muted-foreground text-xs">5</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-muted-foreground">Delivered</h3>
                          <p className="text-sm text-muted-foreground">Estimated: July 20, 2025</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col md:flex-row gap-4 pb-4 border-b">
                      <div className="w-full md:w-20 h-20 bg-muted rounded-md overflow-hidden">
                        <img src="/placeholder.svg" alt="Product Image" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium">Premium Cotton Textiles</h3>
                        <p className="text-sm text-muted-foreground">100% Organic Cotton, 180-200 GSM</p>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                          <p className="text-sm">
                            Unit Price: <span className="font-medium">$14.75/kg</span>
                          </p>
                          <p className="text-sm">
                            Quantity: <span className="font-medium">1,000 kg</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">$14,750.00</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>$14,750.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shipping</span>
                        <span>$1,200.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Import Duties & Taxes</span>
                        <span>$950.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Platform Fee</span>
                        <span>-$295.00</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium">
                        <span>Total</span>
                        <span>$16,605.00</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-medium mb-2">Shipping From</h3>
                      <p className="text-sm">Textile Exports Ltd.</p>
                      <p className="text-sm">123 Industrial Area</p>
                      <p className="text-sm">Mumbai, Maharashtra 400001</p>
                      <p className="text-sm">India</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-2">Shipping To</h3>
                      <p className="text-sm">Dubai Imports LLC</p>
                      <p className="text-sm">456 Business Bay</p>
                      <p className="text-sm">Dubai</p>
                      <p className="text-sm">United Arab Emirates</p>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div>
                    <h3 className="font-medium mb-2">Shipping Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Method</p>
                        <p className="font-medium">Sea Freight</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                        <p className="font-medium">July 15-20, 2025</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Tracking Number</p>
                        <p className="font-medium">Not Available Yet</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Payment Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Payment Status</h3>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid (In Escrow)</Badge>
                    <p className="text-sm mt-2">
                      Payment is held in escrow and will be released to the seller once you confirm receipt of the
                      order.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Payment Details</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Payment Method</span>
                        <span className="text-sm font-medium">Bank Transfer</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Transaction ID</span>
                        <span className="text-sm font-medium">TRX-2025-78901</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Payment Date</span>
                        <span className="text-sm font-medium">June 20, 2025</span>
                      </div>
                    </div>
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
                      <Icons.user className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Textile Exports Ltd.</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Verified Seller
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Contact Person</span>
                      <span className="text-sm font-medium">Rajesh Sharma</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Email</span>
                      <span className="text-sm font-medium">contact@textileexports.com</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Phone</span>
                      <span className="text-sm font-medium">+91 98765 43210</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Contact Seller
                  </Button>
                </CardFooter>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Need Help?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm">
                    If you have any questions or issues with your order, our support team is here to help.
                  </p>
                  <div className="grid gap-2">
                    <Button variant="outline" className="w-full">
                      Open Support Ticket
                    </Button>
                    <Button variant="outline" className="w-full">
                      View Order Documents
                    </Button>
                    <Button variant="outline" className="w-full">
                      Request Modification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
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

