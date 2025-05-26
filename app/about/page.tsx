"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { faUsers } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";

function CounterSection() {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <div ref={ref} className="flex-col items-center lg:grid grid-cols-2 gap-8">
      <div className="flex flex-col items-center text-center px-4 py-4"> 
          <h1 className="w-[250px] text-6xl font-bold text-primary">
          {inView ? <CountUp end={20} duration={3} separator="," /> : "0"}+
          </h1>
          <p className="text-secondary text-3xl font-bold mt-2">Happy Customers</p>
      </div>
      {/* <div className="flex flex-col items-center text-center px-4 py-4">
        <h1 className="w-[250px] text-6xl font-bold text-primary">
          {inView ? <CountUp end={500} duration={3} separator="," /> : "0"}+
        </h1>
        <p className="text-secondary text-3xl font-bold mt-2">Verified Vendors</p>
      </div> */}
      <div className="flex flex-col items-center text-center px-4 py-4">
        <h1 className="w-[250px] text-6xl font-bold text-primary">
          {inView ? <CountUp end={50} duration={3} separator="," /> : "0"}+
        </h1>
        <p className="text-secondary text-3xl font-bold mt-2">Auctions Hosted</p>
      </div>
      {/* <div className="flex flex-col items-center text-center px-4 py-4">
        <h1 className="w-[250px] text-6xl font-bold text-primary">
          {inView ? <CountUp end={1200} duration={3} separator="," /> : "0"}+
        </h1>
        <p className="text-secondary text-3xl font-bold mt-2">Successful Deals</p>
      </div> */}
    </div>
  );
}
  
export default function AboutPage() {
  return (
    <div className="flex flex-col">
      <section className="w-76 py-12 md:py-24 lg:py-32">
              <div className="container px-4 md:px-6">
                <div className="flex flex-row text-left justify-between max-md:flex-col items-center">
                  <div className="flex flex-col">
                    <div className="animate-fade-in mt-4 max-md:items-center">
                      <p className="pt-2 pl-2 font-bold text-4xl text-muted-foreground max-md:text-center">
                        About
                      </p>
                      <h1 className="font-helvetica p-2 pt-0 text-8xl font-bold mr-2 tracking-tighter bg-gradient-to-b from-primary to-secondary bg-clip-text text-transparent max-md:text-center">
                          ZecBay
                      </h1>
                      <p className=" pl-2 font-bold text-2xl text-muted-foreground max-md:text-center">
                      Power Behind the Bid
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block w-64 h-64">
                    <FontAwesomeIcon icon={faUsers} className="w-64 h-64 text-primary"/>
                  </div>
                </div>
              </div>
            </section>

      <section className="w-full py-24 md:py-24 lg:pt-72">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Our Story</h2>
            <p className="max-w-[900px] text-2xl text-muted-foreground">
            ZecBay started with a question:
            What if global sourcing could be faster, leaner, and more transparent?
            From that vision, we built a platform where buyers post what they need, and verified sellers compete to offer the best price and value. By turning the traditional auction into a reverse auction, we create opportunities for cost savings, speed, and global expansion.
            We’re not just another trading platform. We’re a movement — for smarter procurement, fair competition, and real-time decision making.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="flex flex-col px-4 md:px-6 items-center">
        <h2 className="text-5xl font-bold tracking-tight mb-4">Our Mission</h2>
          <div className="flex flex-row-reverse items-center">
            <div className="pl-8 max-w-[720px]">
              
              <p className="text-muted-foreground text-2xl mb-4">
                ZecBay was founded with a clear mission: to revolutionize international trade between India and the World
                by creating a transparent, efficient, and secure marketplace that benefits both exporters and importers.
              </p>
              <p className="text-muted-foreground text-2xl mb-4">
                We believe that by leveraging technology, we can remove traditional barriers to international trade,
                reduce friction in the export-import process, and create new opportunities for businesses of all sizes.
              </p>
              <p className="text-muted-foreground text-2xl">
                Our auction-based system ensures fair pricing, while our verification process guarantees that all
                participants are legitimate businesses, creating a trusted environment for international trade.
              </p>
            </div>
            <div className="rounded-lg">
              <img src="/tradeimage.jpeg" alt="ZecBay Mission" className="w-[700px] h-[400px] max-xl:hidden" />
            </div>
          </div>
        </div>
      </section>

      <section className="w-3/4 mx-auto py-12 mb-4 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center text-secondary">
            <h2 className="text-5xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Numbers That Speak
            </h2>
            <p className="max-w-[700px] text-xl text-muted-foreground">
            Here's what we've achieved so far...
            </p>

            <CounterSection />
          </div>
        </div>
      </section>
      
      <section className="w-3/4 mx-auto py-12 mb-4 md:py-24 lg:py-32 bg-muted/90 rounded-xl">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center text-secondary">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Deals Don’t Wait. Neither Should You</h2>
            <p className="max-w-[700px] text-lg">
            Tap into a fast-moving B2B auction network made for businesses like yours
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button asChild size="lg" className="bg-white text-primary text-bold hover:bg-gray-300">
                <Link href="/signup">Create Account</Link>
              </Button>
              <Button asChild size="lg" className="bg-white text-primary text-bold hover:bg-gray-300 ">
                <Link href="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}
