"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Icons } from "@/components/icons"

export function RFPResponseForm() {
  const [files, setFiles] = useState<File[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would submit the response to your backend
    alert("Response submitted successfully!")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="price">Price Per Unit (USD)</Label>
        <Input id="price" type="number" step="0.01" placeholder="0.00" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="quantity">Available Quantity (kg)</Label>
        <Input id="quantity" type="number" placeholder="0" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="delivery">Estimated Delivery Time (days)</Label>
        <Input id="delivery" type="number" placeholder="30" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="proposal">Proposal Details</Label>
        <Textarea
          id="proposal"
          placeholder="Describe your proposal in detail, including product specifications, payment terms, and any other relevant information."
          className="min-h-[150px]"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Attachments</Label>
        <div className="grid gap-2">
          {files.map((file, index) => (
            <div key={index} className="flex items-center justify-between p-2 border rounded-md">
              <div className="flex items-center gap-2">
                <Icons.file className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                <span className="text-xs text-muted-foreground">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
              <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(index)}>
                <Icons.trash className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            </div>
          ))}

          <div className="flex items-center justify-center border border-dashed rounded-md p-4">
            <label htmlFor="file-upload" className="cursor-pointer text-center">
              <div className="flex flex-col items-center gap-1">
                <Icons.upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm font-medium">Click to upload or drag and drop</span>
                <span className="text-xs text-muted-foreground">PDF, DOCX, XLSX, JPG, PNG (Max 10MB)</span>
              </div>
              <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} multiple />
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" className="flex-1">
          Submit Response
        </Button>
        <Button type="button" variant="outline" className="flex-1">
          Save as Draft
        </Button>
      </div>
    </form>
  )
}

