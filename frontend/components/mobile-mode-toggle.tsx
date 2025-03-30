"use client"

import { Home, Building } from "lucide-react"
import { useModeStore } from "@/lib/services/modeService"
import { useRouter, usePathname } from "next/navigation"
import { useMediaQuery } from "@/hooks/use-media-query"

export default function MobileModeToggle() {
  const { mode, setMode, canSwitchMode } = useModeStore()
  const router = useRouter()
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 768px)")

  const handleModeChange = (newMode: "buyer" | "seller") => {
    if (!canSwitchMode(pathname, isMobile)) return
    
    setMode(newMode)

    // Redirect to the appropriate home page
    if (newMode === "buyer") {
      router.push("/buyer")
    } else {
      router.push("/seller")
    }
  }

  // Don't render if mode switching is not allowed
  if (!canSwitchMode(pathname, isMobile)) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 md:hidden">
      <div className="bg-white rounded-full shadow-lg border border-neutral-200 flex">
        <button
          onClick={() => handleModeChange("buyer")}
          className={`flex items-center px-4 py-2 rounded-l-full ${
            mode === "buyer" ? "bg-primary-600 text-white" : "text-neutral-600"
          }`}
        >
          <Home size={18} className="mr-2" />
          <span className="text-sm font-medium">Buyer</span>
        </button>
        <button
          onClick={() => handleModeChange("seller")}
          className={`flex items-center px-4 py-2 rounded-r-full ${
            mode === "seller" ? "bg-accent-500 text-white" : "text-neutral-600"
          }`}
        >
          <Building size={18} className="mr-2" />
          <span className="text-sm font-medium">Seller</span>
        </button>
      </div>
    </div>
  )
}

