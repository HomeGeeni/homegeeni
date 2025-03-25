"use client"

import { Home, Building } from "lucide-react"
import { useModeStore } from "@/lib/services/modeService"
import { useRouter } from "next/navigation"

export default function MobileModeToggle() {
  const { mode, setMode } = useModeStore()
  const router = useRouter()

  const handleModeChange = (newMode: "buyer" | "seller") => {
    setMode(newMode)

    // Redirect to the appropriate home page
    if (newMode === "buyer") {
      router.push("/buyer")
    } else {
      router.push("/seller")
    }
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

