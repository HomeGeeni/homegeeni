"use client"

import { MessageCircle } from "lucide-react"
import ChatInterface from "./ChatInterface"
import { useUIStateStore } from "@/lib/services/uiStateService"

export default function FloatingChat({ className = "" }: { className?: string }) {
  const { activeFloatingMenu, setActiveFloatingMenu } = useUIStateStore()

  const toggleChat = () => {
    if (activeFloatingMenu === "chat") {
      setActiveFloatingMenu("none")
    } else {
      setActiveFloatingMenu("chat")
    }
  }

  return (
    <div className={`hidden md:block fixed bottom-8 right-8 z-50 ${className}`}>
      <button
        onClick={toggleChat}
        className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors"
        aria-label="Open chat"
      >
        <MessageCircle className="w-6 h-6 text-white" />
      </button>

      {activeFloatingMenu === "chat" && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[600px] bg-white rounded-lg shadow-xl border border-neutral-200">
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
    </div>
  )
}

