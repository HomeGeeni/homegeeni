"use client"

import { useState, useEffect } from "react"
import { Menu, X, Home, Building } from "lucide-react"
import Link from "next/link"
import { useModeStore } from "@/lib/services/modeService"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [displayText, setDisplayText] = useState("HomeGeeni.ai")
  const baseText = "HomeGeeni."
  const extensions = ["ai", "com"]
  const [currentExtIndex, setCurrentExtIndex] = useState(0)
  const { mode } = useModeStore()

  useEffect(() => {
    const animateText = async () => {
      // Backspace the current extension
      for (let i = extensions[currentExtIndex].length; i > 0; i--) {
        setDisplayText(baseText + extensions[currentExtIndex].slice(0, i))
        await new Promise((resolve) => setTimeout(resolve, 150))
      }

      // Switch to next extension
      const nextIndex = (currentExtIndex + 1) % extensions.length
      setCurrentExtIndex(nextIndex)

      // Type the new extension
      for (let i = 1; i <= extensions[nextIndex].length; i++) {
        setDisplayText(baseText + extensions[nextIndex].slice(0, i))
        await new Promise((resolve) => setTimeout(resolve, 150))
      }
    }

    const interval = setInterval(animateText, 5000)
    return () => clearInterval(interval)
  }, [currentExtIndex])

  const buyerLinks = [
    { href: "/buyer", label: "Home" },
    { href: "/preferences", label: "Preferences" },
    { href: "/actions", label: "Actions" },
    { href: "/profile", label: "Profile" },
  ]

  const sellerLinks = [
    { href: "/seller", label: "Dashboard" },
    { href: "/seller/offers", label: "Offers" },
    { href: "/seller/showings", label: "Showings" },
    { href: "/profile", label: "Profile" },
  ]

  const links = mode === "buyer" ? buyerLinks : sellerLinks

  return (
    <header className="bg-white border-b border-neutral-200 py-4 px-4 md:px-6 flex justify-between items-center sticky top-0 z-40">
      <div className="flex items-center">
        <Link href={mode === "buyer" ? "/buyer" : "/seller"} className="flex items-center">
          <span className={`text-xl font-bold ${mode === "buyer" ? "text-primary-600" : "text-accent-500"}`}>
            {displayText}
          </span>
          <span
            className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
              mode === "buyer" ? "bg-primary-100 text-primary-700" : "bg-accent-100 text-accent-700"
            }`}
          >
            {mode === "buyer" ? (
              <span className="flex items-center">
                <Home size={12} className="mr-1" />
                Buyer
              </span>
            ) : (
              <span className="flex items-center">
                <Building size={12} className="mr-1" />
                Seller
              </span>
            )}
          </span>
        </Link>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={`text-neutral-700 hover:${mode === "buyer" ? "text-primary-600" : "text-accent-500"}`}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Mobile Menu Button */}
      <div className="flex items-center md:hidden">
        <button className="p-2 text-neutral-700" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-neutral-200 shadow-lg md:hidden z-50">
          <nav className="flex flex-col py-4">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="px-6 py-3 text-neutral-700 hover:bg-neutral-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  )
}

