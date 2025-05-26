import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { Icons } from "@/components/icons"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function RFPPage() {
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
              <h1 className="text-3xl font-bold tracking-tight">RFP Exchange</h1>
              <p className="text-muted-foreground">Exchange Request for Proposals with verified businesses</p>
            </div>
            <Button>
              <Icons.add className="mr-2 h-4 w-4" />
              Create New RFP
            </Button>
          </div>

          <Tabs defaultValue="received" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="received">Received RFPs</TabsTrigger>
              <TabsTrigger value="sent">Sent RFPs</TabsTrigger>
              <TabsTrigger value="drafts">Drafts</TabsTrigger>
            </TabsList>
            <TabsContent value="received" className="mt-6">
              <div className="grid gap-6">
                {[1, 2, 3].map((item) => (
                  <RFPCard
                    key={item}
                    title="Bulk Order of Premium Cotton Textiles"
                    sender="Dubai Imports LLC"
                    date="June 15, 2025"
                    status="pending"
                    category="Textiles"
                    description="Looking for high-quality cotton textiles for our retail chain. Require samples and detailed specifications before finalizing the order."
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="sent" className="mt-6">
              <div className="grid gap-6">
                {[1, 2].map((item) => (
                  <RFPCard
                    key={item}
                    title="Organic Spices Collection for Export"
                    sender="You to Al Madina Trading"
                    date="June 10, 2025"
                    status="responded"
                    category="Food & Agriculture"
                    description="Proposal for supplying organic spices collection including turmeric, cardamom, and black pepper. Certification and quality standards included."
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="drafts" className="mt-6">
              <div className="grid gap-6">
                <RFPCard
                  title="Handcrafted Jewelry Collection"
                  sender="Draft"
                  date="Last edited: June 5, 2025"
                  status="draft"
                  category="Jewelry"
                  description="Draft proposal for exporting handcrafted jewelry collection featuring traditional Indian designs with modern aesthetics."
                />
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

interface RFPCardProps {
  title: string
  sender: string
  date: string
  status: "pending" | "responded" | "draft" | "completed"
  category: string
  description: string
}

function RFPCard({ title, sender, date, status, category, description }: RFPCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="mb-2">
              {category}
            </Badge>
            <CardTitle>{title}</CardTitle>
            <CardDescription className="mt-1">
              From: {sender} • {date}
            </CardDescription>
          </div>
          <Badge
            variant={
              status === "pending"
                ? "secondary"
                : status === "responded"
                  ? "default"
                  : status === "completed"
                    ? "outline"
                    : "outline"
            }
          >
            {status === "pending"
              ? "Pending Response"
              : status === "responded"
                ? "Responded"
                : status === "completed"
                  ? "Completed"
                  : "Draft"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">{status === "draft" ? "Edit Draft" : "View Details"}</Button>
        {status === "pending" && <Button>Respond</Button>}
        {status === "responded" && <Button variant="secondary">View Response</Button>}
        {status === "draft" && <Button>Send RFP</Button>}
      </CardFooter>
    </Card>
  )
}

