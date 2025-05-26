"use client"
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Check, Upload } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export default function VerificationPage() {
  const [activeStep, setActiveStep] = useState(0)
  const [userType, setUserType] = useState("exporter")
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({})
  const [bankDetails, setBankDetails] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    ifscCode: "",
    swiftCode: "",
  })

  const exporterSteps = [
    {
      title: "Business Registration",
      description: "Upload your business registration certificate",
      documents: ["GST Registration Certificate", "IEC (Import Export Code)", "Company Registration Proof", "Company PAN Card"],
    },
    {
      title: "Identity Verification",
      description: "Verify the identity of business owners/directors",
      documents: ["Director's ID Proof", "Address Proof", "Passport Size Photograph"],
    },
    {
      title: "Bank Account Details",
      description: "Provide your business bank account details for payments",
      documents: ["Bank Account Details", "Bank Statement (Last 3 months) / Cancelled Cheque", "Letter of Undertaking (LUT)"],
    },
    {
      title: "Customs & Trade Compliance Verification",
      description: "Provide your category specific customs and trade compliance information)",
      documents: ["Export Promotion Council Registration", "BIS Certificate (if applicable)", "FSSAI License (if applicable)"],
    },
    {
      title: "Export History",
      description: "Provide details of your previous export experience (if any)",
      documents: ["Previous Export Documents", "Client References"],
    },
    {
      title: "Review & Submit",
      description: "Review your information and submit for verification",
      documents: [],
    },
  ]

  const importerSteps = [
    {
      title: "Business Registration",
      description: "Upload your business registration certificate",
      documents: ["Trade License", "Chamber of Commerce Membership", "VAT Registration", "Company PAN Card"],
    },
    {
      title: "Identity Verification",
      description: "Verify the identity of business owners/directors",
      documents: ["Emirates ID", "Passport Copy", "Visa Copy"],
    },
    {
      title: "Bank Account Details",
      description: "Provide your business bank account details for payments",
      documents: ["Bank Account Details", "Bank Statement (Last 3 months) / Cancelled Cheque", "Bank Reference Letter"],
    },
    {
      title: "Customs & Trade Compliance Verification",
      description: "Provide your category specific customs and trade compliance information)",
      documents: ["Importer Code from UAE Customs", "Product Specific Approvals (if applicable)"],
    },
    {
      title: "Import History",
      description: "Provide details of your previous import experience (if any)",
      documents: ["Previous Import Documents", "Supplier References"],
    },
    {
      title: "Review & Submit",
      description: "Review your information and submit for verification",
      documents: [],
    },
  ]

  const steps = userType === "exporter" ? exporterSteps : importerSteps

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docName: string) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles({
        ...uploadedFiles,
        [docName]: [...(uploadedFiles[docName] || []), ...Array.from(e.target.files)],
      })
    }
  }

  const isStepComplete = (stepIndex: number) => {
    if (stepIndex >= steps.length) return false

    // For the bank details step
    if (stepIndex === 2) {
      const bankFieldsFilled = Object.values(bankDetails).every((value) => value.trim() !== "")
      const documentsUploaded = steps[stepIndex].documents.every(
        (doc) => uploadedFiles[doc] && uploadedFiles[doc].length > 0,
      )
      return bankFieldsFilled && documentsUploaded
    }

    // For the review step, no documents are required
    if (steps[stepIndex].documents.length === 0) return true

    // Check if all documents for this step are uploaded
    return steps[stepIndex].documents.every((doc) => uploadedFiles[doc] && uploadedFiles[doc].length > 0)
  }

  const goToNextStep = () => {
    if (activeStep < steps.length - 1 && isStepComplete(activeStep)) {
      setActiveStep(activeStep + 1)
      window.scrollTo(0, 0)
    }
  }

  const goToPrevStep = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1)
      window.scrollTo(0, 0)
    }
  }

  const handleSubmitVerification = () => {
    // In a real app, you would submit all the data to your backend
    alert("Verification documents submitted successfully! Your application is now under review.")
    window.location.href = "/dashboard"
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        <Link href="/dashboard" className="flex items-center text-primary hover:underline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>

        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Verification</h1>
          <p className="text-muted-foreground">Complete the verification process to start trading on ZecBay</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>{steps[activeStep].title}</CardTitle>
                <CardDescription>{steps[activeStep].description}</CardDescription>
              </div>
              <Badge variant={activeStep === steps.length - 1 ? "default" : "outline"}>
                Step {activeStep + 1} of {steps.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                        index < activeStep
                          ? "bg-primary border-primary text-primary-foreground"
                          : index === activeStep
                            ? "border-primary text-primary"
                            : "border-muted-foreground text-muted-foreground"
                      }`}
                    >
                      {index < activeStep ? <Check className="h-5 w-5" /> : <span>{index + 1}</span>}
                    </div>
                    <span className={`mt-2 text-xs ${index <= activeStep ? "text-primary" : "text-muted-foreground"}`}>
                      {step.title}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 h-1 w-full bg-muted">
                <div
                  className="h-1 bg-primary transition-all"
                  style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
                ></div>
              </div>
            </div>

            {activeStep === 2 ? (
              // Bank Account Details Step
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="account-name">Account Holder Name</Label>
                    <Input
                      id="account-name"
                      value={bankDetails.accountName}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input
                      id="account-number"
                      value={bankDetails.accountNumber}
                      onChange={(e) => setBankDetails({ ...bankDetails, accountNumber: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank-name">Bank Name</Label>
                    <Input
                      id="bank-name"
                      value={bankDetails.bankName}
                      onChange={(e) => setBankDetails({ ...bankDetails, bankName: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ifsc-code">IFSC Code</Label>
                    <Input
                      id="ifsc-code"
                      value={bankDetails.ifscCode}
                      onChange={(e) => setBankDetails({ ...bankDetails, ifscCode: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="swift-code">SWIFT Code (For International Transfers)</Label>
                    <Input
                      id="swift-code"
                      value={bankDetails.swiftCode}
                      onChange={(e) => setBankDetails({ ...bankDetails, swiftCode: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  {steps[activeStep].documents.map((doc, index) => (
                    <div key={index} className="grid gap-2">
                      <Label htmlFor={`doc-${activeStep}-${index}`}>{doc}</Label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Input
                            id={`doc-${activeStep}-${index}`}
                            type="file"
                            className="cursor-pointer"
                            onChange={(e) => handleFileChange(e, doc)}
                          />
                        </div>
                        {uploadedFiles[doc]?.length > 0 && (
                          <div className="flex items-center text-sm text-green-600">
                            <Check className="mr-1 h-4 w-4" />
                            {uploadedFiles[doc].length} file(s) uploaded
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeStep === 3 ? (
              // Export/Import History Step
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="export-experience">{userType === "exporter" ? "Export" : "Import"} Experience</Label>
                  <Textarea
                    id="export-experience"
                    placeholder={`Describe your previous ${userType === "exporter" ? "export" : "import"} experience...`}
                    className="min-h-[120px]"
                  />
                  <p className="text-sm text-muted-foreground">
                    If you're new to {userType === "exporter" ? "exporting" : "importing"}, you can leave this blank.
                  </p>
                </div>

                <Separator />

                <div className="space-y-4">
                  {steps[activeStep].documents.map((doc, index) => (
                    <div key={index} className="grid gap-2">
                      <Label htmlFor={`doc-${activeStep}-${index}`}>{doc}</Label>
                      <div className="flex items-center gap-2">
                        <div className="relative flex-1">
                          <Input
                            id={`doc-${activeStep}-${index}`}
                            type="file"
                            className="cursor-pointer"
                            onChange={(e) => handleFileChange(e, doc)}
                          />
                        </div>
                        {uploadedFiles[doc]?.length > 0 && (
                          <div className="flex items-center text-sm text-green-600">
                            <Check className="mr-1 h-4 w-4" />
                            {uploadedFiles[doc].length} file(s) uploaded
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">Optional: Upload if you have previous experience.</p>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeStep === 4 ? (
              // Review & Submit Step
              <div className="space-y-6">
                <div className="rounded-lg border p-4 space-y-4">
                  <div>
                    <h3 className="font-medium">Business Registration</h3>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {exporterSteps[0].documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {uploadedFiles[doc]?.length > 0 ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4 rounded-full bg-red-500" />
                          )}
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium">Identity Verification</h3>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {exporterSteps[1].documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {uploadedFiles[doc]?.length > 0 ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4 rounded-full bg-red-500" />
                          )}
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium">Bank Account Details</h3>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Account Holder Name</p>
                        <p className="text-sm">{bankDetails.accountName || "Not provided"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Account Number</p>
                        <p className="text-sm">{bankDetails.accountNumber || "Not provided"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">Bank Name</p>
                        <p className="text-sm">{bankDetails.bankName || "Not provided"}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">IFSC Code</p>
                        <p className="text-sm">{bankDetails.ifscCode || "Not provided"}</p>
                      </div>
                    </div>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {exporterSteps[2].documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {uploadedFiles[doc]?.length > 0 ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <div className="h-4 w-4 rounded-full bg-red-500" />
                          )}
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium">Export History</h3>
                    <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {exporterSteps[3].documents.map((doc, index) => (
                        <div key={index} className="flex items-center gap-2">
                          {uploadedFiles[doc]?.length > 0 ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <span className="text-xs text-muted-foreground">(Optional)</span>
                          )}
                          <span className="text-sm">{doc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800 p-4">
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-yellow-100 dark:bg-yellow-800 flex items-center justify-center">
                      <Upload className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="font-medium">Verification Process</h3>
                      <p className="text-sm mt-1">
                        Your verification documents will be reviewed by our team within 2-3 business days. You will
                        receive an email notification once your verification is complete.
                      </p>
                      <p className="text-sm mt-2">
                        While your verification is pending, you can explore the platform but will have limited access to
                        features.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <input type="checkbox" id="confirm" className="rounded border-gray-300" required />
                  <Label htmlFor="confirm" className="text-sm">
                    I confirm that all the information provided is accurate and authentic. I understand that providing
                    false information may result in account termination.
                  </Label>
                </div>
              </div>
            ) : (
              // Document Upload Steps (0 and 1)
              <div className="space-y-4">
                {steps[activeStep].documents.map((doc, index) => (
                  <div key={index} className="grid gap-2">
                    <Label htmlFor={`doc-${activeStep}-${index}`}>{doc}</Label>
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <Input
                          id={`doc-${activeStep}-${index}`}
                          type="file"
                          className="cursor-pointer"
                          onChange={(e) => handleFileChange(e, doc)}
                        />
                      </div>
                      {uploadedFiles[doc]?.length > 0 && (
                        <div className="flex items-center text-sm text-green-600">
                          <Check className="mr-1 h-4 w-4" />
                          {uploadedFiles[doc].length} file(s) uploaded
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={goToPrevStep} disabled={activeStep === 0}>
              Previous
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button onClick={handleSubmitVerification}>Submit for Verification</Button>
            ) : (
              <Button onClick={goToNextStep} disabled={!isStepComplete(activeStep)}>
                Next
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

