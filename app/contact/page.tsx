"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
  
    try {
      const res = await fetch("https://zecbay-backend.vercel.app/api/contact/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      })
  
      if (res.ok) {
        alert("Thank you for your enquiry! We'll get back to you shortly.")
        setForm({ name: "", email: "", subject: "", message: "" })
      } else {
        alert("Something went wrong. Please try again.")
      }
    } catch (error) {
      console.error("Error submitting form:", error)
      alert("An error occurred. Please try again later.")
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-6 text-center">Contact Us</h1>
      <p className="text-muted-foreground text-center mb-10">
        For any enquiries, please fill out the form below or email us directly at{" "}
        <Link
          href="https://mail.google.com/mail/?view=cm&to=zecbay25@gmail.com&su=Subject&body=Body%20text"
          className="text-primary underline"
          target="_blank"
        >
          zecbay25@gmail.com
        </Link>
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block mb-1 font-medium" htmlFor="name">
            Name
          </label>
          <Input
            type="text"
            name="name"
            id="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="email">
            Email
          </label>
          <Input
            type="email"
            name="email"
            id="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="subject">
            Subject
          </label>
          <Input
            type="text"
            name="subject"
            id="subject"
            value={form.subject}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium" htmlFor="message">
            Message
          </label>
          <Textarea
            name="message"
            id="message"
            rows={5}
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>

        <Button type="submit" className="w-full">
          Submit Enquiry
        </Button>
      </form>
    </div>
  )
}
