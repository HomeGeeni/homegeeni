export type ActionType = "property" | "page" | "link"

export interface PropertyInfo {
  price: number
  originalPrice?: number
  priceReductionPercentage?: number
  bedrooms?: number
  bathrooms?: number
  area?: number
}

export interface ChatSuggestion {
  type: ActionType
  title: string
  description?: string
  image?: string
  propertyInfo?: PropertyInfo
  action: {
    url?: string
    propertyId?: string
    pageRoute?: string
  }
}

export interface ChatMessage {
  id: string
  type: "user" | "bot"
  text: string
  timestamp: number
  suggestions?: ChatSuggestion[]
}

