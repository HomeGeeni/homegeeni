import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import Header from "@/components/header"
import BottomNavigation from "@/components/bottom-navigation"
import FloatingChat from "@/components/FloatingChat"
import ModeToggle from "@/components/mode-toggle"
import MobileModeToggle from "@/components/mobile-mode-toggle"
import ConfirmationDialog from "@/components/confirmation-dialog"
import PropertyDetailModal from "@/components/property-detail-modal"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "HomeGeeni - AI-Powered Real Estate Platform",
  description: "Find your perfect home with AI-powered insights and valuations",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        <main className="pb-20 md:pb-0">{children}</main>
        <FloatingChat />
        <ModeToggle />
        <MobileModeToggle />
        <BottomNavigation />
        <ConfirmationDialog />
        <PropertyDetailModal />
      </body>
    </html>
  )
}



import './globals.css'