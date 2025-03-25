"use client"

import { create } from "zustand"
import type { ChatMessage, ChatSuggestion } from "../types/chat"

interface ChatState {
  messages: ChatMessage[]
  addMessage: (message: Omit<ChatMessage, "id" | "timestamp">) => void
  clearMessages: () => void
}

// Mock suggestions based on user input
const getMockSuggestions = (userInput: string): ChatSuggestion[] => {
  const input = userInput.toLowerCase()

  if (input.includes("house") || input.includes("property") || input.includes("home")) {
    return [
      {
        type: "property",
        title: "3 Bedroom Modern House",
        description: "Beautiful modern house with garden in prime location",
        image: "/images/house1.jpg",
        propertyInfo: {
          price: 750000,
          originalPrice: 850000,
          priceReductionPercentage: 12,
          bedrooms: 3,
          bathrooms: 2,
          area: 2200,
        },
        action: { propertyId: "123" },
      },
      {
        type: "property",
        title: "Luxury Penthouse",
        description: "Stunning penthouse with panoramic views",
        image: "/images/house2.jpg",
        propertyInfo: {
          price: 1200000,
          originalPrice: 1500000,
          priceReductionPercentage: 20,
          bedrooms: 4,
          bathrooms: 3,
          area: 3000,
        },
        action: { propertyId: "124" },
      },
      {
        type: "page",
        title: "View All Properties",
        description: "Browse our full catalog of reduced price properties",
        action: { pageRoute: "/buyer" },
      },
    ]
  }

  if (input.includes("preference") || input.includes("like")) {
    return [
      {
        type: "page",
        title: "Update Preferences",
        description: "Set your home preferences",
        action: { pageRoute: "/preferences" },
      },
    ]
  }

  if (input.includes("profile") || input.includes("account")) {
    return [
      {
        type: "page",
        title: "Your Profile",
        description: "View and edit your profile",
        action: { pageRoute: "/profile" },
      },
    ]
  }

  return [
    {
      type: "page",
      title: "Explore Properties",
      description: "Find your dream home",
      action: { pageRoute: "/buyer" },
    },
  ]
}

// Mock bot responses
const getBotResponse = (userInput: string): string => {
  const input = userInput.toLowerCase()

  if (input.includes("house") || input.includes("property") || input.includes("home")) {
    return "I found some great properties with recent price reductions! Take a look at these options:"
  }

  if (input.includes("preference") || input.includes("like")) {
    return "Let's update your preferences to help find better matches for you:"
  }

  if (input.includes("profile") || input.includes("account")) {
    return "You can manage your account settings here:"
  }

  return "I'm here to help you find your perfect home. What would you like to know about?"
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => {
      const newMessage: ChatMessage = {
        ...message,
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now(),
      }

      // If it's a user message, automatically add a bot response
      if (message.type === "user") {
        const botResponse: ChatMessage = {
          id: Math.random().toString(36).substring(7),
          type: "bot",
          text: getBotResponse(message.text),
          timestamp: Date.now() + 500, // Slight delay for bot response
          suggestions: getMockSuggestions(message.text),
        }
        return { messages: [...state.messages, newMessage, botResponse] }
      }

      return { messages: [...state.messages, newMessage] }
    }),
  clearMessages: () => set({ messages: [] }),
}))

