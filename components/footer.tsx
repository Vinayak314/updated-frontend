"use client"

import Link from "next/link"
import ReactDOM from 'react-dom'
import { faInstagram, faLinkedin, faFacebook }from '@fortawesome/free-brands-svg-icons'
import { faPhone, faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { usePathname } from "next/navigation"

export function Footer() {
  const pathname = usePathname() || ""; // Ensure pathname is always a string

  return (
    <footer className="w-full h-[80px] border-t bg-background py-6">
      <div className="container flex flex-col items-center justify-center">
      {(pathname !== "/login") && (pathname !== "/signup") ? 
      ( <div className="flex flex-col gap-4 items-center text-sm text-muted-foreground">
            Contact Us
        <div className="flex flex-row gap-4 text-sm text-muted-foreground">
          <Link
            href="https://www.linkedin.com/company/zecbay/posts/?feedView=all"
            target="_blank">
            <FontAwesomeIcon icon={faLinkedin} className="w-8 h-8"/>
          </Link> 
          <Link
            href="https://www.instagram.com/join.zecbay/"
            target="_blank">
            <FontAwesomeIcon icon={faInstagram} className="w-8 h-8"/>
          </Link>
          <Link
            href="https://www.facebook.com/profile.php?id=61572868627413"
            target="_blank">
            <FontAwesomeIcon icon={faFacebook} className="w-7 h-8"/>
          </Link>
          <Link
            href="https://mail.google.com/mail/?view=cm&to=zecbay25@gmail.com"
            target="_blank">
              <FontAwesomeIcon icon={faEnvelope} className="text-sm text-muted-foreground w-8 h-8"/>
          </Link>
        </div>
        </div>
      ): null}
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} ZecBay. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

