"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Icons } from "@/components/icons"

interface Document {
  name: string
  file: File | null
  uploaded: boolean
}

interface Step {
  title: string
  description: string
  documents: string[]
}

interface StepsProps {
  steps: Step[]
}

export function Steps({ steps }: StepsProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [documents, setDocuments] = useState<Record<string, Document>>({})

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, docName: string) => {
    if (e.target.files && e.target.files[0]) {
      setDocuments({
        ...documents,
        [docName]: {
          name: docName,
          file: e.target.files[0],
          uploaded: true,
        },
      })
    }
  }

  const isStepComplete = (stepIndex: number) => {
    if (stepIndex >= steps.length) return false

    // For the review step, no documents are required
    if (steps[stepIndex].documents.length === 0) return true

    // Check if all documents for this step are uploaded
    return steps[stepIndex].documents.every((doc) => documents[doc] && documents[doc].uploaded)
  }

  const goToNextStep = () => {
    if (currentStep < steps.length - 1 && isStepComplete(currentStep)) {
      setCurrentStep(currentStep + 1)
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                index < currentStep
                  ? "bg-primary border-primary text-primary-foreground"
                  : index === currentStep
                    ? "border-primary text-primary"
                    : "border-muted-foreground text-muted-foreground"
              }`}
            >
              {index < currentStep ? <Icons.check className="h-5 w-5" /> : <span>{index + 1}</span>}
            </div>
            <span className={`mt-2 text-xs ${index <= currentStep ? "text-primary" : "text-muted-foreground"}`}>
              {step.title}
            </span>
          </div>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium">{steps[currentStep].title}</h3>
              <p className="text-sm text-muted-foreground">{steps[currentStep].description}</p>
            </div>

            {steps[currentStep].documents.length > 0 ? (
              <div className="space-y-4">
                {steps[currentStep].documents.map((doc, index) => (
                  <div key={index} className="grid gap-2">
                    <Label htmlFor={`doc-${index}`}>{doc}</Label>
                    <div className="flex items-center gap-2">
                      <Input id={`doc-${index}`} type="file" onChange={(e) => handleFileChange(e, doc)} />
                      {documents[doc]?.uploaded && (
                        <div className="flex items-center text-sm text-green-600">
                          <Icons.check className="mr-1 h-4 w-4" />
                          Uploaded
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Icons.document className="h-10 w-10 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-medium">Document Review</h3>
                <p className="mt-2 text-sm text-muted-foreground max-w-md">
                  Our team will review your submitted documents and verify your business. This process typically takes
                  2-3 business days.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={goToPrevStep} disabled={currentStep === 0}>
          Previous
        </Button>
        <Button onClick={goToNextStep} disabled={currentStep === steps.length - 1 || !isStepComplete(currentStep)}>
          {currentStep === steps.length - 1 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  )
}

