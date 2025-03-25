"use client"
import { Home, Building } from "lucide-react"
import { useModeStore } from "@/lib/services/modeService"
import { useUIStateStore } from "@/lib/services/uiStateService"
import { useRouter } from "next/navigation"

export default function ModeToggle({ className = "" }: { className?: string }) {
  const { mode, setMode } = useModeStore()
  const { activeFloatingMenu, setActiveFloatingMenu } = useUIStateStore()
  const router = useRouter()

  const toggleMenu = () => {
    if (activeFloatingMenu === "mode") {
      setActiveFloatingMenu("none")
    } else {
      setActiveFloatingMenu("mode")
    }
  }

  const handleModeChange = (newMode: "buyer" | "seller") => {
    setMode(newMode)
    setActiveFloatingMenu("none")

    // Redirect to the appropriate home page
    if (newMode === "buyer") {
      router.push("/buyer")
    } else {
      router.push("/seller")
    }
  }

  return (
    <div className={`hidden md:block fixed bottom-24 right-8 z-50 ${className}`}>
      <button
        onClick={toggleMenu}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-colors ${
          mode === "buyer"
            ? "bg-primary-600 hover:bg-primary-700 text-white"
            : "bg-accent-500 hover:bg-accent-600 text-white"
        }`}
        aria-label="Toggle mode"
      >
        {mode === "buyer" ? <Home className="w-6 h-6" /> : <Building className="w-6 h-6" />}
      </button>

      {activeFloatingMenu === "mode" && (
        <div className="absolute bottom-16 right-0 w-64 bg-white rounded-lg shadow-xl border border-neutral-200">
          <div className="p-4">
            <h3 className="font-semibold mb-3">Switch Mode</h3>
            <div className="space-y-2">
              <button
                onClick={() => handleModeChange("buyer")}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  mode === "buyer" ? "bg-primary-50 text-primary-700" : "hover:bg-neutral-50"
                }`}
              >
                <Home className="mr-3" size={20} />
                <div className="text-left">
                  <div className="font-medium">Buyer Mode</div>
                  <div className="text-sm text-neutral-500">Browse and purchase properties</div>
                </div>
              </button>

              <button
                onClick={() => handleModeChange("seller")}
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  mode === "seller" ? "bg-accent-50 text-accent-700" : "hover:bg-neutral-50"
                }`}
              >
                <Building className="mr-3" size={20} />
                <div className="text-left">
                  <div className="font-medium">Seller Mode</div>
                  <div className="text-sm text-neutral-500">List and manage your properties</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

