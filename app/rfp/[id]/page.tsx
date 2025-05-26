import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RFPResponseForm } from "@/components/rfp-response-form"
import Link from "next/link"

export default function RFPDetailPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the RFP details based on the ID
  const rfpId = params.id

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
            <Link href="/rfp" className="text-primary hover:underline flex items-center mb-4">
              <Icons.chevronLeft className="mr-1 h-4 w-4" />
              Back to RFP Exchange
            </Link>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">Bulk Order of Premium Cotton Textiles</h1>
                  <Badge>Textiles</Badge>
                </div>
                <p className="text-muted-foreground">RFP ID: {rfpId} • From: Dubai Imports LLC • June 15, 2025</p>
              </div>
              <Badge variant="secondary" className="w-fit">
                Pending Response
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>RFP Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-2">Overview</h3>
                    <p className="text-sm text-muted-foreground">
                      Dubai Imports LLC is looking for high-quality cotton textiles for our retail chain. We require
                      samples and detailed specifications before finalizing the order. We are interested in establishing
                      a long-term relationship with reliable suppliers who can consistently deliver premium products.
                    </p>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Requirements</h3>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                      <li>100% Organic Cotton</li>
                      <li>Weight: 180-200 GSM</li>
                      <li>Width: 58-60 inches</li>
                      <li>GOTS Certification required</li>
                      <li>Multiple color options</li>
                      <li>Minimum order: 5,000 kg initially</li>
                      <li>Regular orders of 10,000-15,000 kg monthly</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Timeline</h3>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc pl-5">
                      <li>Sample submission: Within 2 weeks</li>
                      <li>Sample evaluation: 1 week</li>
                      <li>Initial order placement: By July 15, 2025</li>
                      <li>Delivery required: By August 30, 2025</li>
                    </ul>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2">Additional Information</h3>
                    <p className="text-sm text-muted-foreground">
                      We prefer suppliers who can provide complete documentation including test reports, certifications,
                      and sustainability practices. Price competitiveness is important, but quality and reliability are
                      our primary concerns. We are open to negotiation on terms for the right supplier.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Icons.file className="h-4 w-4" />
                      Download Full RFP
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Icons.image className="h-4 w-4" />
                      View Attachments (3)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Buyer Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Icons.user className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Dubai Imports LLC</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Verified Buyer
                        </Badge>
                        <p className="text-xs text-muted-foreground">Member since 2023</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Location</p>
                      <p className="font-medium">Dubai, UAE</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Business Type</p>
                      <p className="font-medium">Retail Chain</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Previous Orders</p>
                      <p className="font-medium">32</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <p className="font-medium">4.9/5 (28 reviews)</p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    Contact Buyer
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Respond to RFP</CardTitle>
                  <CardDescription>Submit your proposal in response to this RFP</CardDescription>
                </CardHeader>
                <CardContent>
                  <RFPResponseForm />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Similar RFPs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { title: "Organic Cotton for Home Textiles", buyer: "Al Futtaim Group", date: "June 10, 2025" },
                    { title: "Premium Fabrics for Fashion Line", buyer: "Emirates Fashion", date: "June 8, 2025" },
                    { title: "Sustainable Textiles for Hotels", buyer: "Jumeirah Group", date: "June 5, 2025" },
                  ].map((rfp, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <p className="font-medium">{rfp.title}</p>
                        <p className="text-xs text-muted-foreground">{rfp.buyer}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-muted-foreground">{rfp.date}</p>
                        <Link href="#" className="text-xs text-primary hover:underline">
                          View
                        </Link>
                      </div>
                    </div>
                  ))}
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

