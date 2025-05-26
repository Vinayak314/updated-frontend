"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Plus, Trash2, Edit, Heading1 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface Variant {
  id: string;
  name: string;
  description: string;
  quantity: string;
  quantityUnit: string;
  customQuantityUnit: string;
  basePrice: string;
  unit: string;
  customUnit: string;
}

export default function ListProductPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showAuctionSuccess, setShowAuctionSuccess] = useState(false);
  const [step, setStep] = useState(1)

  const router = useRouter()

  // Product details (shared across all variants)
  const [productName, setProductName] = useState("");
  const [mainCategory, setMainCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [hsCode, setHsCode] = useState("");
  const [rounds, setRounds] = useState("1");

  // Variants management
  const [variants, setVariants] = useState<Variant[]>([{
    id: '1',
    name: '',
    description: '',
    quantity: '',
    quantityUnit: '',
    customQuantityUnit: '',
    basePrice: '',
    unit: '',
    customUnit: ''
  }]);

  // Currently editing variant
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);
  const [showVariantDialog, setShowVariantDialog] = useState(false);

  // Additional details
  const [user, setUser] = useState<{
      name: string
      email: string
      username: string
      phone: string
      id: number
      user_type: string
      password: string
      business_details: {
        gst_number: string
        pan_number: string
        iec: string
      }
    } | null>(null)

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

  // Variant utility functions
  const getFinalUnit = (variant: Variant) => variant.unit === "other" ? variant.customUnit : variant.unit;
  const getFinalQuantityUnit = (variant: Variant) => variant.quantityUnit === "other" ? variant.customQuantityUnit : variant.quantityUnit;
  const getCombinedQuantity = (variant: Variant) => `${variant.quantity} ${getFinalQuantityUnit(variant)}`;

  // Add new variant
  const addVariant = () => {
    const newVariant: Variant = {
      id: Date.now().toString(),
      name: '',
      description: '',
      quantity: '',
      quantityUnit: '',
      customQuantityUnit: '',
      basePrice: '',
      unit: '',
      customUnit: ''
    };
    setEditingVariant(newVariant);
    setShowVariantDialog(true);
  };

  // Edit existing variant
  const editVariant = (variant: Variant) => {
    setEditingVariant({ ...variant });
    setShowVariantDialog(true);
  };

  // Save variant (add or update)
  const saveVariant = () => {
    if (!editingVariant) return;

    if (!editingVariant.name || !editingVariant.description || !editingVariant.quantity || !editingVariant.basePrice || !editingVariant.unit || !editingVariant.quantityUnit) {
      alert("Please fill in all required fields for the variant.");
      return;
    }

    const existingIndex = variants.findIndex(v => v.id === editingVariant.id);
    if (existingIndex >= 0) {
      // Update existing variant
      const updatedVariants = [...variants];
      updatedVariants[existingIndex] = editingVariant;
      setVariants(updatedVariants);
    } else {
      // Add new variant
      setVariants([...variants, editingVariant]);
    }

    setShowVariantDialog(false);
    setEditingVariant(null);
  };

  // Delete variant
  const deleteVariant = (id: string) => {
    if (variants.length <= 1) {
      alert("You must have at least one variant.");
      return;
    }
    setVariants(variants.filter(v => v.id !== id));
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      setProductName(localStorage.getItem("productName") || "");
      setMainCategory(localStorage.getItem("mainCategory") || "");
      setSubCategory(localStorage.getItem("subCategory") || "");
      setHsCode(localStorage.getItem("hsCode") || "");
      setRounds(localStorage.getItem("rounds") || "1");

      // Load variants from localStorage
      const storedVariants = localStorage.getItem("variants");
      if (storedVariants) {
        try {
          const parsedVariants = JSON.parse(storedVariants);
          setVariants(parsedVariants);
        } catch (error) {
          console.error("Error parsing stored variants:", error);
        }
      }

      // Get the user data from localStorage
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      }
    }
  }, []);

  useEffect(() => {
    // Store the form data in localStorage whenever it changes
    if (typeof window !== "undefined") {
      localStorage.setItem("productName", productName);
      localStorage.setItem("mainCategory", mainCategory);
      localStorage.setItem("subCategory", subCategory);
      localStorage.setItem("hsCode", hsCode);
      localStorage.setItem("rounds", rounds);
      localStorage.setItem("variants", JSON.stringify(variants));
    }
  }, [productName, mainCategory, subCategory, hsCode, rounds, variants]);

  const handleNextStep = () => {
    setStep(step + 1)
    window.scrollTo(0, 0)
  }

  const handlePrevStep = () => {
    setStep(step - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Check if username is available
    const username = user?.username;
    if (!username) {
        alert("You must be logged in to list a product.");
        setIsLoading(false);
        return;
    }

    // Check if all required fields are filled
    if (!productName || !mainCategory || !subCategory || variants.length === 0) {
      alert("Please fill in all the required fields and add at least one variant.");
      setIsLoading(false);
      return;
    }

    // Validate all variants
    for (const variant of variants) {
      if(variant.id == '1'){
        continue
      }

      if (!variant.name || !variant.description || !variant.quantity || !variant.basePrice || !variant.unit || !variant.quantityUnit) {
        alert(`Please complete all fields for variant: ${variant.name || 'Unnamed variant'}`);
        setIsLoading(false);
        return;
      }
    }

    try {
      // Submit variants one by one (sequential submission)
      let successCount = 0;
      let failureCount = 0;

      for (const variant of variants) {
        if (variant.id == '1'){
          continue
        }

        try {
          const formData = new FormData()
          formData.append("product_name", productName)
          formData.append("category", mainCategory)
          formData.append("subcategory", subCategory)
          formData.append("hs_code", hsCode)
          formData.append("description", variant.description)
          formData.append("quantity", getCombinedQuantity(variant))
          formData.append("initial_price", variant.basePrice)
          formData.append("unit", getFinalUnit(variant))
          formData.append("rounds", rounds)
          formData.append("username", user.username)
          formData.append("variant", variant.name)

          const response = await fetch("https://zecbay-backend.vercel.app/api/list-product/", {
            method: "POST",
            body: formData,
          });

          if (response.ok) {
            successCount++;
          } else {
            const errorData = await response.json()
            console.error(`Failed to create variant ${variant.name}:`, errorData.error || "Unknown error");
            failureCount++;
          }
        } catch (variantError) {
          console.error(`Error submitting variant ${variant.name}:`, variantError);
          failureCount++;
        }
      }

      if (successCount > 0) {
        // Clear the product data from localStorage after successful submission
        localStorage.removeItem('productName');
        localStorage.removeItem('mainCategory');
        localStorage.removeItem('subCategory');
        localStorage.removeItem('hsCode');
        localStorage.removeItem('rounds');
        localStorage.removeItem('variants');

        if (failureCount === 0) {
          // All successful
          setShowAuctionSuccess(true);
        } else {
          // Partial success
          alert(`${successCount} auction(s) created successfully, ${failureCount} failed. Please check and retry for failed variants.`);
          setShowAuctionSuccess(true);
        }
      } else {
        // All failed
        alert("All auctions failed to create. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form", error)
      alert("Error submitting form.")
    } finally {
      setIsLoading(false)
    }
  }

  const isStep1Valid = () => {
    return productName && mainCategory && subCategory && variants.length > 0 && 
           variants.every(v => v.name && v.description && v.quantity && v.basePrice && v.unit && v.quantityUnit);
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <Link href="/dashboard" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">List Your Product</h1>
          <p className="text-muted-foreground">Create auction listings for your product variants</p>
        </div>

        <div className="flex items-center space-x-4">
          <Badge variant={step === 1 ? "default" : "outline"}>Step 1: Product & Variants</Badge>
          <div className="h-0.5 flex-1 bg-muted"></div>
          <Badge variant={step === 2 ? "default" : "outline"}>Step 2: Review & Submit</Badge>
        </div>

        <Card>
        {step === 1 && (
          <form>
            <CardHeader>
              <CardTitle>Product Details</CardTitle>
              <CardDescription>
                Provide basic product information that applies to all variants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Product Title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Premium Cotton Textiles"
                  required
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="main-category">Category</Label>
                  <Select value={mainCategory} onValueChange={(val) => {
                    setMainCategory(val);
                    setSubCategory("");
                  }}>
                    <SelectTrigger id="main-category">
                      <SelectValue placeholder="Select main category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.name} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sub-category">Subcategory</Label>
                  <Select
                    value={subCategory}
                    onValueChange={setSubCategory}
                    disabled={!mainCategory}
                  >
                    <SelectTrigger id="sub-category">
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .find((cat) => cat.name === mainCategory)
                        ?.subcategories.map((sub) => (
                          <SelectItem key={sub} value={sub}>
                            {sub}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="hs-code">HS Code</Label>
                  <Input
                    id="hs-code"
                    placeholder="e.g. 620520 (6 digit code)"
                    value={hsCode}
                    onChange={(e) => setHsCode(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Harmonized System Code for your product (optional)</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rounds">Rounds</Label>
                  <Input
                    id="rounds"
                    type="number"
                    value={rounds}
                    onChange={(e) => setRounds(e.target.value)}
                    readOnly
                    required
                  />
                </div>
              </div>

              <Separator />

              {/* Variants Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Product Variants</h3>
                    <p className="text-sm text-muted-foreground">Add different variants of your product with specific pricing and quantities</p>
                  </div>
                  <Button type="button" onClick={addVariant} size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Variant
                  </Button>
                </div>

                  <div className="space-y-3">
                    {variants.map((variant) =>
                      variant.id == '1'? null:
                      (<Card key={variant.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{variant.name}</h4>
                            <div className="text-sm text-muted-foreground mt-1 space-y-1">
                              <div>
                                <span>Qty: {getCombinedQuantity(variant)}</span>
                                <span className="mx-2">•</span>
                                <span>Price: {variant.basePrice} per {getFinalUnit(variant)}</span>
                              </div>
                              {variant.description && (
                                <div className="text-xs">
                                  <span className="font-medium">Description:</span> {variant.description.length > 100 ? variant.description.substring(0, 100) + '...' : variant.description}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button type="button" variant="outline" size="sm" onClick={() => editVariant(variant)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm" 
                              onClick={() => deleteVariant(variant.id)}
                              disabled={variants.length <= 1}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>)
                    )}
                  </div>
              </div>
            </CardContent>

            <CardFooter className="flex justify-between">
              <div></div>
              <Button type="button" onClick={handleNextStep} disabled={!(variants.length>1)}>
                Next: Review & Submit
              </Button>
            </CardFooter>
          </form>
        )}

          {/* Step 2: Review & Submit */}
          {step === 2 && (
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Review & Submit</CardTitle>
                <CardDescription>Review your product and variant details before submitting</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-3">Product Details</h3>
                  <div className="space-y-2">
                    <p><strong>Title:</strong> {productName}</p>
                    <p><strong>Category:</strong> {mainCategory} &gt; {subCategory}</p>
                    <p><strong>HS Code:</strong> {hsCode || 'Not specified'}</p>
                    <p><strong>Rounds:</strong> {rounds}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-bold text-lg mb-3">Variants ({variants.length-1})</h3>
                  <div className="space-y-4">
                    {variants.map((variant, index) => 
                    variant.id == '1'? null:(
                      <Card key={variant.id} className="p-4">
                        <h4 className="font-semibold mb-2">{variant.name}</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                          <p><strong>Quantity:</strong> {getCombinedQuantity(variant)}</p>
                          <p><strong>Base Price:</strong> {variant.basePrice}</p>
                          <p><strong>Unit:</strong> {getFinalUnit(variant)}</p>
                        </div>
                        {variant.description && (
                          <div className="text-sm">
                            <p><strong>Description:</strong> {variant.description}</p>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Terms & Conditions</Label>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="terms" className="rounded border-gray-300" required />
                    <Label htmlFor="terms" className="text-sm">
                      I confirm that all the information provided is accurate and I agree to the{" "}
                      <span className="text-primary">Auction Terms & Conditions</span>.
                    </Label>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" onClick={handlePrevStep}>
                  Back
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating Auctions..." : `Submit Auction${(variants.length-1) > 1 ? 's' : ''} (${variants.length-1})`}
                </Button>
              </CardFooter>
            </form>
          )}
        </Card>

        {/* Variant Dialog */}
        <Dialog open={showVariantDialog} onOpenChange={setShowVariantDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingVariant && variants.find(v => v.id === editingVariant.id) ? 'Edit Variant' : 'Add New Variant'}
              </DialogTitle>
              <DialogDescription>
                Specify the details for this product variant
              </DialogDescription>
            </DialogHeader>
            
            {editingVariant && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="variant-name">Variant Name</Label>
                  <Input
                    id="variant-name"
                    placeholder="e.g. Length-100m, Material-Cotton"
                    value={editingVariant.name}
                    onChange={(e) => setEditingVariant({...editingVariant, name: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="variant-description">Description</Label>
                  <Textarea
                    id="variant-description"
                    placeholder="Describe this specific variant in detail..."
                    className="min-h-[100px]"
                    value={editingVariant.description}
                    onChange={(e) => setEditingVariant({...editingVariant, description: e.target.value})}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="variant-quantity">Quantity</Label>
                    <Input
                      id="variant-quantity"
                      type="string"
                      placeholder="e.g. 1000"
                      value={editingVariant.quantity}
                      onChange={(e) => setEditingVariant({...editingVariant, quantity: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variant-quantity-unit">Quantity Unit</Label>
                    <Select 
                      value={editingVariant.quantityUnit} 
                      onValueChange={(val) => setEditingVariant({...editingVariant, quantityUnit: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="liter">liter</SelectItem>
                        <SelectItem value="meter">meter</SelectItem>
                        <SelectItem value="piece">piece</SelectItem>
                        <SelectItem value="ton">ton</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {editingVariant.quantityUnit === "other" && (
                      <Input
                        placeholder="Enter custom quantity unit"
                        value={editingVariant.customQuantityUnit}
                        onChange={(e) => setEditingVariant({...editingVariant, customQuantityUnit: e.target.value})}
                        required
                      />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="variant-price">Base Price</Label>
                    <Input
                      id="variant-price"
                      type="number"
                      placeholder="e.g. 50"
                      value={editingVariant.basePrice}
                      onChange={(e) => setEditingVariant({...editingVariant, basePrice: e.target.value})}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="variant-unit">Unit</Label>
                    <Select 
                      value={editingVariant.unit} 
                      onValueChange={(val) => setEditingVariant({...editingVariant, unit: val})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="kg">kg</SelectItem>
                        <SelectItem value="liter">liter</SelectItem>
                        <SelectItem value="meter">meter</SelectItem>
                        <SelectItem value="piece">piece</SelectItem>
                        <SelectItem value="ton">ton</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {editingVariant.unit === "other" && (
                      <Input
                        placeholder="Enter custom unit"
                        value={editingVariant.customUnit}
                        onChange={(e) => setEditingVariant({...editingVariant, customUnit: e.target.value})}
                        required
                      />
                    )}
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowVariantDialog(false)}>
                Cancel
              </Button>
              <Button type="button" onClick={saveVariant}>
                Save Variant
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={showAuctionSuccess} onOpenChange={setShowAuctionSuccess}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Auctions Created Successfully</DialogTitle>
              <DialogDescription>
                {variants.length-1} auction{(variants.length-1) > 1 ? 's have' : ' has'} been successfully created and listed.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => {
                  setShowAuctionSuccess(false);
                  window.location.href = "/auctions";
                }}
              >
                OK
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}