"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Home, Heart, FileText, User } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check for mobile screens on client side
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const navItems = [
    { name: "Home", href: "/buyer", icon: <Home size={24} /> },
    { name: "Preferences", href: "/preferences", icon: <Heart size={24} /> },
    { name: "Actions", href: "/actions", icon: <FileText size={24} /> },
    { name: "Profile", href: "/profile", icon: <User size={24} /> },
  ]

  // Desktop navbar
  if (!isMobile) {
    return (
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/buyer" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-primary-600">HomeGeeni</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="px-3 py-2 rounded-md text-sm font-medium text-neutral-700 hover:bg-primary-50 hover:text-primary-700"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </nav>
    )
  }

  // Mobile navbar (bottom navigation)
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg z-50">
      <div className="flex justify-around">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex flex-col items-center py-2 text-neutral-500 hover:text-primary-600"
          >
            <div className="flex items-center justify-center">{item.icon}</div>
            <span className="text-xs mt-1">{item.name}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

