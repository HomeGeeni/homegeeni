"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { ChatSuggestion } from "@/lib/types/chat"
import { useChatStore } from "@/lib/services/chatService"
import { Send } from "lucide-react"
import Image from "next/image"

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

export default function ChatInterface() {
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { messages, addMessage } = useChatStore()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    addMessage({
      type: "user",
      text: input.trim(),
    })
    setInput("")
  }

  const handleSuggestionClick = (suggestion: ChatSuggestion) => {
    if (suggestion.action.pageRoute) {
      router.push(suggestion.action.pageRoute)
    } else if (suggestion.action.propertyId) {
      router.push(`/property/${suggestion.action.propertyId}`)
    } else if (suggestion.action.url) {
      window.open(suggestion.action.url, "_blank")
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.type === "user" ? "bg-primary text-white" : "bg-neutral-100 text-neutral-900"
              }`}
            >
              <p>{message.text}</p>
              {message.suggestions && (
                <div className="mt-3 space-y-2">
                  {message.suggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="w-full bg-white rounded-lg p-3 shadow-sm hover:shadow transition-shadow flex items-start space-x-3 text-left"
                    >
                      {suggestion.image && (
                        <div className="relative w-24 h-24 flex-shrink-0">
                          <Image
                            src={suggestion.image}
                            alt={suggestion.title}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-neutral-900 mb-1">{suggestion.title}</h4>
                        {suggestion.description && (
                          <p className="text-sm text-neutral-500 mb-2">{suggestion.description}</p>
                        )}
                        {suggestion.propertyInfo && (
                          <div className="space-y-1">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg font-semibold text-neutral-900">
                                {formatPrice(suggestion.propertyInfo.price)}
                              </span>
                              {suggestion.propertyInfo.priceReductionPercentage && (
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
                                  {suggestion.propertyInfo.priceReductionPercentage}% Price Cut
                                </span>
                              )}
                            </div>
                            {suggestion.propertyInfo.originalPrice && (
                              <div className="text-sm text-neutral-500">
                                <span className="line-through">
                                  {formatPrice(suggestion.propertyInfo.originalPrice)}
                                </span>
                              </div>
                            )}
                            <div className="text-sm text-neutral-600 flex items-center space-x-3">
                              {suggestion.propertyInfo.bedrooms && <span>{suggestion.propertyInfo.bedrooms} beds</span>}
                              {suggestion.propertyInfo.bathrooms && (
                                <span>{suggestion.propertyInfo.bathrooms} baths</span>
                              )}
                              {suggestion.propertyInfo.area && <span>{suggestion.propertyInfo.area} sqft</span>}
                            </div>
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t border-neutral-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  )
}

