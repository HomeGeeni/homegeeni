export interface Property {
  id: string
  address: string
  city: string
  state: string
  zipCode: string
  price: number
  estimatedValue: number
  daysOnMarket: number
  percentMatch: number
  sqft: number
  pricePerSqft: number
  beds: number
  baths: number
  yearBuilt: number
  propertyType: "Single Family" | "Condo" | "Townhouse" | "Multi-Family"
  description: string
  aiSummary: string
  images: string[]
  location: {
    lat: number
    lng: number
  }
  features: string[]
  sellerDisclosure?: string
  status: "Active" | "Pending" | "Sold"
  liked?: boolean
  superliked?: boolean
  showings?: Showing[]
  offers?: Offer[]
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  profileImage?: string
  preferences: UserPreferences
  savedProperties: string[]
  viewedProperties: string[]
  showings: Showing[]
  offers: Offer[]
}

export interface UserPreferences {
  priceRange: {
    min: number
    max: number
  }
  beds: {
    min: number
    max: number
  }
  baths: {
    min: number
    max: number
  }
  propertyTypes: ("Single Family" | "Condo" | "Townhouse" | "Multi-Family")[]
  locations: {
    address: string
    lat: number
    lng: number
  }[]
}

export interface Showing {
  id: string
  propertyId: string
  date: Date
  startTime: string
  endTime: string
  notes?: string
  status: "Scheduled" | "Completed" | "Cancelled"
}

export interface Offer {
  id: string
  propertyId: string
  offerPrice: number
  downPayment: number
  appraisalContingency: {
    waived: boolean
    limit?: number
  }
  inspectionContingency: "Waived" | "Structural and Environmental" | "Complete"
  financingContingency: boolean
  paymentMethod: "Cash" | "Mortgage"
  closingDate: Date
  additionalNotes?: string
  status: "Draft" | "Submitted" | "Accepted" | "Rejected" | "Countered"
  created: Date
  updated: Date
}

