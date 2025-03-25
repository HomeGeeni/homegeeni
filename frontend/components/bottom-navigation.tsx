"use client"

import { Home, Heart, Clipboard, User, MessageCircle, Building } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import ChatInterface from "./ChatInterface"
import { useModeStore } from "@/lib/services/modeService"
import { useUIStateStore } from "@/lib/services/uiStateService"

export default function BottomNavigation() {
  const pathname = usePathname()
  const { mode } = useModeStore()
  const { activeFloatingMenu, setActiveFloatingMenu } = useUIStateStore()

  const isActive = (path: string) => {
    return pathname.startsWith(path)
  }

  const buyerLinks = [
    { href: "/buyer", icon: <Home size={24} />, label: "Home" },
    { href: "/preferences", icon: <Heart size={24} />, label: "Preferences" },
    { href: "/actions", icon: <Clipboard size={24} />, label: "Actions" },
    { href: "/profile", icon: <User size={24} />, label: "Profile" },
  ]

  const sellerLinks = [
    { href: "/seller", icon: <Building size={24} />, label: "Dashboard" },
    { href: "/seller/property/new", icon: <Heart size={24} />, label: "New Listing" },
    { href: "/seller/offers", icon: <Clipboard size={24} />, label: "Offers" },
    { href: "/profile", icon: <User size={24} />, label: "Profile" },
  ]

  // Split links into two parts for the bottom navigation
  const links = mode === "buyer" ? buyerLinks : sellerLinks
  const leftLinks = links.slice(0, 2)
  const rightLinks = links.slice(2)

  const toggleChat = () => {
    if (activeFloatingMenu === "chat") {
      setActiveFloatingMenu("none")
    } else {
      setActiveFloatingMenu("chat")
    }
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 py-2 px-4 flex justify-between items-center z-50 md:hidden">
        <div className="flex justify-around w-2/5">
          {leftLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={`flex flex-col items-center ${
                isActive(link.href) ? (mode === "buyer" ? "text-primary-600" : "text-accent-500") : "text-neutral-500"
              }`}
            >
              {link.icon}
              <span className="text-xs mt-1">{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Chat Button (Centered) */}
        <div className="flex justify-center -mt-8">
          <button onClick={toggleChat} className="flex flex-col items-center relative">
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg ${
                mode === "buyer" ? "bg-primary" : "bg-accent-500"
              }`}
            >
              <MessageCircle size={28} className="text-white" />
            </div>
            <span className={`text-xs mt-1 ${mode === "buyer" ? "text-primary-600" : "text-accent-500"}`}>Chat</span>
          </button>
        </div>

        <div className="flex justify-around w-2/5">
          {rightLinks.map((link, index) => (
            <Link
              key={index}
              href={link.href}
              className={`flex flex-col items-center ${
                isActive(link.href) ? (mode === "buyer" ? "text-primary-600" : "text-accent-500") : "text-neutral-500"
              }`}
            >
              {link.icon}
              <span className="text-xs mt-1">{link.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Chat Modal for Mobile */}
      {activeFloatingMenu === "chat" && (
        <div className="fixed inset-0 bg-white z-50 md:hidden">
          <div className="flex items-center justify-between p-4 border-b border-neutral-200">
            <h3 className="font-semibold">Chat with us</h3>
            <button onClick={() => setActiveFloatingMenu("none")} className="text-neutral-500 hover:text-neutral-700">
              Close
            </button>
          </div>
          <div className="h-[calc(100%-65px)]">
            <ChatInterface />
          </div>
        </div>
      )}
    </>
  )
}

