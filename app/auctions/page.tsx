"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/header";

export default function AuctionsPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [auctions, setAuctions] = useState<any[]>([]);
  const [filteredAuctions, setFilteredAuctions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isImporter, setIsImporter] = useState(false);
  const [variantSelections, setVariantSelections] = useState<Record<string, string>>({});
  const categories = [
    {
      name: "Textiles & Apparels",
      subcategories: [
        "Cotton & Synthetic Fabrics",
        "Readymade Garments",
        "Home Textiles",
        "Woolen & Silk Products",
        "Denim & Industrial Textiles",
      ]
    },
    {
      name: "Handicrafts & Home Decor",
      subcategories: [
        "Wooden Handicrafts",
        "Metal Artware",
        "Marble & Stone Handicrafts",
        "Jute Products",
        "Pottery & Ceramic Decor",
        "Carpets & Rugs",
      ]
    },
    {
      name: "Engineering Goods & Machinery",
      subcategories: [
        "Industrial Machinery",
        "Pumps & Valves",
        "Auto Components",
        "Electrical Equipment",
        "Diesel Engines & Generators",
        "Agricultural Implements",
      ]
    },
    {
      name: "Plastics & Polymers",
      subcategories: [
        "Plastic Packaging Materials",
        "Household Plastic Items",
        "PVC, HDPE, LDPE Products",
        "Recycled Plastic Granules",
      ]
    },
    {
      name: "Leather & Footwear",
      subcategories: [
        "Finished Leather",
        "Leather Footwear",
        "Leather Bags & Accessories",
        "Industrial Leather Gloves",
      ]
    },
    {
      name: "Building & Construction Materials",
      subcategories: [
        "Ceramic Tiles & Sanitaryware",
        "Granite, Marble & Natural Stones",
        "Cement & Clinker",
        "Paints & Coatings",
        "Steel & Iron Products",
      ]
    },
    {
      name: "Automobiles & Spare Parts",
      subcategories: [
        "Two-Wheelers",
        "Three-Wheelers",
        "Auto Spare Parts",
        "Tires & Tubes",
      ]
    },
    {
      name: "Furniture & Wood Products",
      subcategories: [
        "Solid Wood Furniture",
        "MDF & Particle Board",
        "Office & School Furniture",
        "Plywood & Veneers",
      ]
    },
    {
      name: "Eco & Biodegradable Products",
      subcategories: [
        "Areca Leaf Plates",
        "Bamboo Products",
        "Jute Bags",
        "Paper Products",
      ]
    },
    {
      name: "Stationery & Printing",
      subcategories: [
        "Notebooks & Diaries",
        "Printing Paper",
        "Packaging Boxes",
        "Office & Educational Supplies",
      ]
    },
    {
      name: "IT & Electronics",
      subcategories: [
        "Computer Accessories",
        "Mobile Accessories",
        "Consumer Electronics",
        "LED Lights",
      ]
    }
  ];

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category === selectedCategory ? null : category);
    setSelectedSubcategory(null);
  };

  const handleSubcategorySelect = (subcategory: string) => {
    setSelectedSubcategory(subcategory === selectedSubcategory ? null : subcategory);
  };

  // Check user and user type in the component (useEffect to run on client-side only)
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      setIsLoggedIn(true);
      setIsImporter(user?.user_type === "importer");
    } else {
      setIsLoggedIn(false);
    }
    fetchAuctions();
  }, []);

  const fetchAuctions = async () => {
    try {
      const response = await fetch("https://zecbay-backend.vercel.app/api/auctions/");
      const data = await response.json();

      // Check if the data contains an 'auctions' property and it is an array
      if (data.auctions && Array.isArray(data.auctions)) {
        const sortedAuctions = data.auctions.map((auction: any) => {
          // Initialize status as active
          let status = "active";

          const [hours, minutes, seconds] = auction.time_left.split(":").map(Number);
          // Calculate the remaining time in milliseconds
          const totalTimeLeftInMilliseconds = (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
          const currentTime = new Date();
          const auctionEndTime = new Date(currentTime.getTime() + totalTimeLeftInMilliseconds);

          // If auction time is passed, set status to completed
          if (auction.time_left === "Auction ended" || auctionEndTime < currentTime) {
            status = "completed";
          }

          // Get the current price from the lowest bid if available
          let currentPrice = auction.initial_price;
          let userHasBid = false;

          if (auction.bids && auction.bids.length > 0) {
            const lowestBid = auction.bids.reduce((prev: any, current: any) => {
              return prev.price < current.price ? prev : current;
            });
            currentPrice = lowestBid?.price || auction.initial_price;

            // Check if the logged-in user has placed a bid
            const userId = JSON.parse(localStorage.getItem("user") || "{}")?.id;
            if (userId) {
              userHasBid = auction.bids.some((bid: any) => bid.user_id === userId);
            }
          }

          // Add status field to the auction
          return { ...auction, status, currentPrice, totalTimeLeftInMilliseconds, userHasBid };
        })

        // Sorting first by time left (more time remaining comes first) and then by created_at (latest first)
        sortedAuctions.sort((a: any, b: any) => {
          // Compare based on remaining time first
          if (a.totalTimeLeftInMilliseconds !== b.totalTimeLeftInMilliseconds) {
            return b.totalTimeLeftInMilliseconds - a.totalTimeLeftInMilliseconds; // More time left should be first
          }

          // If the time left is equal, sort by creation date (latest first)
          const dateA = new Date(a.created_at);
          const dateB = new Date(b.created_at);
          return dateB.getTime() - dateA.getTime();
        });

        setAuctions(sortedAuctions); // Set the auctions data
        setFilteredAuctions(sortedAuctions); // Set the initial filtered auctions
      } else {
        console.error("No auctions available or invalid response format", data);
        setAuctions([]); // In case of unexpected response, set auctions to an empty array
      }
    } catch (error) {
      console.error("Error fetching auctions:", error);
      setAuctions([]); // In case of an error, ensure auctions is an empty array
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Filter auctions based on the selected category and hide completed ones
    const activeAuctions = auctions.filter((auction) => auction.status === "active" || auction.time_left !== "Auction ended"); // Handle status or time_left

    let filtered = activeAuctions;
    if (selectedCategory && selectedCategory !== "All Categories") {
      filtered = filtered.filter((auction) => auction.category.toLowerCase() === selectedCategory.toLowerCase());
    }

    if (selectedSubcategory) {
      filtered = filtered.filter((auction) => auction.subcategory.toLowerCase() === selectedSubcategory.toLowerCase());
    }

    setFilteredAuctions(filtered);

    // Setup timer to update time_left every second (only for active auctions)
    const timer = setInterval(() => {
      setFilteredAuctions((prevAuctions) => {
        return prevAuctions.map((auction) => {
          if (auction.status === "active" && auction.time_left !== "Auction ended") {
            return {
              ...auction,
              time_left: calculateTimeLeft(auction.time_left),
            };
          }
          return auction;
        });
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedCategory, selectedSubcategory, auctions]);

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

  // Group auctions by product name
  const groupedAuctions = useMemo(() => {
    const grouped: Record<string, any[]> = {};
    filteredAuctions.forEach(auction => {
      if (!grouped[auction.product_name]) {
        grouped[auction.product_name] = [];
      }
      grouped[auction.product_name].push(auction);
    });
    return grouped;
  }, [filteredAuctions]);

  // Handle variant selection change
  const handleVariantChange = (productName: string, variantId: string) => {
    setVariantSelections({
      ...variantSelections,
      [productName]: variantId
    });
  };

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-primary">Auctions</h1>
            <p className="text-muted-foreground font-bold">Browse active auctions <span></span>
            {isLoggedIn && isImporter ? (
              <>
              <span>or</span>{" "}
              <Link
              href="/list-product"
              className="text-primary underline">
              create your own
              </Link>
              </>
            ): null}
              </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)} className="md:hidden">
              <Filter className="h-5 w-5" />
              <span className="sr-only">Toggle filters</span>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className={`${showFilters ? "block" : "hidden"} md:block md:col-span-1`}>
            <Card>
              <CardHeader>
                <CardTitle>Categories</CardTitle>
              </CardHeader>
              <CardContent style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '8px' }}>
                {categories.map((category) => (
                  <div key={category.name}>
                    <Button
                      variant={selectedCategory === category.name ? "default" : "outline"}
                      style={{
                        display: 'flex',
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        padding: '10px',
                        whiteSpace: 'normal',
                      }}
                      onClick={() => handleCategorySelect(category.name)}
                    >
                      {category.name}
                    </Button>

                    {selectedCategory === category.name && (
                      <div
                        className="flex flex-col gap-[8px] p-[8px] mt-[8px] bg-muted-foreground/10 rounded-[6px]"
                        
                      >
                        {category.subcategories.map((subcategory) => (
                          <Button
                            key={subcategory}
                            variant={selectedSubcategory === subcategory ? "default" : "outline"}
                            style={{
                              display: 'flex',
                              width: '100%',
                              justifyContent: 'center',
                              alignItems: 'center',
                              textAlign: 'center',
                              padding: '8px',
                              whiteSpace: 'normal',
                            }}
                            onClick={() => handleSubcategorySelect(subcategory)}
                          >
                            {subcategory}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
              {loading ? (
                <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center ">
                  <img src="/loader.svg" alt="Loading..." className="w-24 h-24" />
                </div>
              ) : Object.keys(groupedAuctions).length === 0 ? (
                <p>No Auctions available</p>
              ) : (
                // Map through product names instead of individual auctions
                Object.keys(groupedAuctions).map(productName => (
                  <div key={productName} className="border rounded-lg p-4 mb-4">
                    <h3 className="text-lg font-bold mb-3 text-secondary">{productName}</h3>
                    
                    {/* Variant dropdown if there's more than one auction with this product name */}
                    {groupedAuctions[productName].length > 1 && (
                      <div className="mb-4 ">
                        <label htmlFor={`variant-${productName}`} className="block text-sm font-medium text-muted-foreground mb-1">
                          Select Variant
                        </label>
                        <select
                          id={`variant-${productName}`}
                          value={variantSelections[productName]}
                          onChange={(e) => handleVariantChange(productName, e.target.value)}
                          className="mt-1 block w-full p-2 bg-primary rounded text-white"
                        >
                          {groupedAuctions[productName].map(auction => (
                            <option key={auction.id} value={auction.id}>
                              {auction.variant}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    {/* Show the selected variant or the only auction if there's just one */}
                    {groupedAuctions[productName]
                      .filter(auction => 
                        groupedAuctions[productName].length === 1 || 
                        auction.id === (variantSelections[productName] || groupedAuctions[productName][0].id)
                      )
                      .map(item => (
                        <AuctionCard
                          key={item.id}
                          id={item.id}
                          product_name={item.product_name}
                          category={item.category}
                          subcategory={item.subcategory}
                          initialPrice={item.initial_price}
                          currentPrice={item.current_price}
                          unit={item.unit}
                          quantity={item.quantity}
                          round={item.round}
                          totalRounds={item.total_rounds}
                          timeLeft={item.time_left}
                          bidsCount={item.bids_count}
                          created_by={item.created_by}
                          status={item.status}
                          isLoggedIn={isLoggedIn}
                          isImporter={isImporter}
                          userHasBid={item.userHasBid}
                          registeredusers={item.register_count}
                          variant={item.variant}

                        />
                      ))
                    }
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AuctionCardProps {
  id: string;
  product_name: string;
  category: string;
  subcategory: string;
  initialPrice: number;
  currentPrice: number;
  unit: string;
  quantity: string;
  round: number;
  totalRounds: number;
  timeLeft: string;
  bidsCount: number;
  created_by: string;
  status: string;
  isLoggedIn: boolean;
  isImporter: boolean;
  userHasBid: boolean;
  registeredusers: number;
  variant?: string; // Added variant as optional prop
}

function AuctionCard({
  id,
  product_name,
  category,
  subcategory,
  initialPrice,
  currentPrice,
  unit,
  quantity,
  round,
  totalRounds,
  timeLeft,
  bidsCount,
  created_by,
  status,
  isLoggedIn,
  isImporter,
  userHasBid,
  registeredusers,
  variant,
}: AuctionCardProps) {
  // Determine if the auction is ended
  const isAuctionEnded = timeLeft === "Auction ended";

  return (
    <Card className="flex flex-col overflow-hidden w-full md:max-w-[90%] mx-auto">
      {/* Right: Content Section (Now Full Width) */}
      <div className="flex flex-col justify-between p-4 space-y-2 relative">
        {/* Moved Badge to Content Top Right */}
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="default">{status === "active" ? "Active" : "Completed"}</Badge>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-start -mt-3">
            <div>
              <Badge variant="outline" className="-mt-1 mb-1">
                {category} - {subcategory}
              </Badge>
              <CardTitle className="text-lg">
                {product_name}
                {variant && <span className="text-sm font-normal ml-2">({variant})</span>}
              </CardTitle>
            </div>
          </div>

          {/* Compact Row with All Details */}
          <div className="grid grid-cols-5 gap-3 text-xs md:text-sm">
            <div>
              <p className="text-muted-foreground">Created by</p>
              <p className="font-medium truncate">{created_by}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Initial Price</p>
              <p className="font-medium">₹{initialPrice.toFixed(2)}/{unit}</p>
            </div>
            <div>
              <p className="text-muted-foreground">
                {isAuctionEnded ? "Final Price" : "Current Price"}
              </p>
              <p className="font-medium">₹{currentPrice.toFixed(2)}/{unit}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Quantity</p>
              <p className="font-medium">{quantity.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Registered Users</p>
              <p className="font-medium">{registeredusers.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-1 text-xs md:text-sm">
            <div className="flex justify-between">
              <span>Round {round} of {totalRounds}</span>
              <span>{bidsCount} bids</span>
            </div>
            <div className="w-full bg-muted rounded-full h-3">
              <div
                className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(0, 100 - (parseInt(timeLeft.split(':')[0]) * 4))}%` }}
              />
            </div>
            <div className="flex justify-between">
              <span>Time left:</span>
              <span className="font-medium">{timeLeft}</span>
            </div>
          </div>
        </div>
  
        <CardFooter className="p-0 pt-2">
          <Button asChild className="w-full text-xs">
            <Link href={isLoggedIn ? `/auctions/${id}` : "/login"}>
              {status === "active" ? (
                isLoggedIn ? (
                  isImporter || !userHasBid ? "View Details" : "View Bid"
                ) : (
                  "Please log in to register"
                )
              ) : (
                "View Results"
              )}
            </Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  );
}