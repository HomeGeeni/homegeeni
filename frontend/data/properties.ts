export interface Property {
  id: string
  address: string
  city: string
  state: string
  zipCode: string
  price: number
  originalPrice?: number
  estimatedValue: number
  daysOnMarket: number
  percentMatch: number
  squareFeet: number
  pricePerSquareFoot: number
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
  sellerDisclosure?: {
    roofAge: number
    hvacAge: number
    waterHeaterAge: number
    knownIssues: string[]
  }
  showings?: {
    date: string
    startTime: string
    endTime: string
  }[]
  offers?: {
    id: string
    offerPrice: number
    downPayment: number
    appraisalInfo: string
    paymentMethod: "Cash" | "Mortgage"
    closingDate: string
    inspectionContingency: "Waived" | "Structural and Environmental" | "Complete"
    financingContingency: "Waived" | "Not Waived"
    appraisalContingency: "Waived" | { limit: number }
    additionalInfo: string
    status: "Pending" | "Accepted" | "Rejected" | "Countered"
  }[]
  liked?: boolean
  superLiked?: boolean
}

export const properties: Property[] = [
  {
    id: "1",
    address: "123 Main Street",
    city: "Austin",
    state: "TX",
    zipCode: "78701",
    price: 750000,
    originalPrice: 850000,
    estimatedValue: 765000,
    daysOnMarket: 7,
    percentMatch: 92,
    squareFeet: 2200,
    pricePerSquareFoot: 341,
    beds: 4,
    baths: 3,
    yearBuilt: 2015,
    propertyType: "Single Family",
    description:
      "Beautiful modern home in the heart of downtown Austin. Recently renovated with high-end finishes throughout. Open floor plan with lots of natural light. Large backyard perfect for entertaining.",
    aiSummary:
      "This property has recently had a significant price reduction of $100,000. Originally listed at $850,000, it's now priced slightly below market value and matches 92% of your preferences. The home is relatively new (built in 2015) and offers excellent value at $341 per square foot for the downtown Austin area. With 4 bedrooms and 3 bathrooms, it provides ample space for a growing family or home office setup.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    location: {
      lat: 30.2672,
      lng: -97.7431,
    },
    features: [
      "Hardwood floors",
      "Granite countertops",
      "Stainless steel appliances",
      "Smart home features",
      "Two-car garage",
      "Outdoor kitchen",
    ],
    sellerDisclosure: {
      roofAge: 7,
      hvacAge: 3,
      waterHeaterAge: 5,
      knownIssues: ["Minor crack in basement foundation (repaired 2019)", "Replaced kitchen sink faucet (2021)"],
    },
  },
  {
    id: "2",
    address: "456 Oak Avenue",
    city: "Austin",
    state: "TX",
    zipCode: "78704",
    price: 925000,
    originalPrice: 999000,
    estimatedValue: 900000,
    daysOnMarket: 14,
    percentMatch: 87,
    squareFeet: 2800,
    pricePerSquareFoot: 330,
    beds: 5,
    baths: 3.5,
    yearBuilt: 2010,
    propertyType: "Single Family",
    description:
      "Spacious family home in the desirable South Congress area. Features include a chef's kitchen, home office, and large primary suite. Beautiful landscaped yard with mature trees. Recently reduced for quick sale.",
    aiSummary:
      "This South Congress property has been reduced by $74,000 from its original listing price. While still priced slightly above our estimated market value, it offers excellent space at 2,800 square feet. With 5 bedrooms and 3.5 bathrooms, it's ideal for larger families. The home matches 87% of your preferences and the recent price cut suggests the seller is motivated.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    location: {
      lat: 30.25,
      lng: -97.75,
    },
    features: ["Chef's kitchen", "Home office", "Walk-in closets", "Fireplace", "Covered patio", "Mature landscaping"],
    sellerDisclosure: {
      roofAge: 12,
      hvacAge: 2,
      waterHeaterAge: 8,
      knownIssues: ["Replaced upstairs bathroom shower (2020)", "New fence installed (2021)"],
    },
  },
  {
    id: "3",
    address: "789 Pine Lane",
    city: "Austin",
    state: "TX",
    zipCode: "78745",
    price: 550000,
    estimatedValue: 575000,
    daysOnMarket: 3,
    percentMatch: 95,
    squareFeet: 1800,
    pricePerSquareFoot: 306,
    beds: 3,
    baths: 2,
    yearBuilt: 2018,
    propertyType: "Townhouse",
    description:
      "Modern townhouse in a gated community with resort-style amenities. Open concept living with high ceilings and premium finishes. Low-maintenance living with proximity to shopping and dining.",
    aiSummary:
      "This townhouse is an excellent value, priced below our estimated market value with a high 95% match to your preferences. Built in 2018, it's nearly new and offers modern features. At only 3 days on market, we recommend acting quickly as properties in this area typically sell within 10 days.",
    images: ["/placeholder.svg?height=600&width=800", "/placeholder.svg?height=600&width=800"],
    location: {
      lat: 30.22,
      lng: -97.76,
    },
    features: [
      "Gated community",
      "Community pool",
      "Fitness center",
      "High ceilings",
      "Energy efficient appliances",
      "Attached garage",
    ],
    sellerDisclosure: {
      roofAge: 4,
      hvacAge: 4,
      waterHeaterAge: 4,
      knownIssues: ["No known issues"],
    },
  },
  {
    id: "4",
    address: "101 Riverside Drive",
    city: "Austin",
    state: "TX",
    zipCode: "78741",
    price: 1200000,
    originalPrice: 1350000,
    estimatedValue: 1250000,
    daysOnMarket: 21,
    percentMatch: 82,
    squareFeet: 3200,
    pricePerSquareFoot: 375,
    beds: 4,
    baths: 4,
    yearBuilt: 2005,
    propertyType: "Condo",
    description:
      "Luxury waterfront condo with panoramic views of Lady Bird Lake. Floor-to-ceiling windows, private balcony, and high-end finishes throughout. Building amenities include concierge, pool, and fitness center. Price recently reduced by $150,000.",
    aiSummary:
      "This luxury condo has seen a substantial price reduction of $150,000 from its original listing price. Now priced below our estimated market value, it offers stunning waterfront views. With 21 days on market and the significant price cut, there may be additional room for negotiation. The 82% match is lower primarily due to the price point being above your preferred range, but the property offers exceptional amenities and location.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    location: {
      lat: 30.258,
      lng: -97.7292,
    },
    features: [
      "Waterfront views",
      "Concierge service",
      "Rooftop pool",
      "Private balcony",
      "Wine cellar",
      "Smart home technology",
    ],
    sellerDisclosure: {
      roofAge: 5,
      hvacAge: 7,
      waterHeaterAge: 3,
      knownIssues: [
        "HOA planning special assessment for lobby renovation in 2024",
        "Minor water damage repair in guest bathroom (2022)",
      ],
    },
  },
  {
    id: "5",
    address: "222 Cedar Street",
    city: "Austin",
    state: "TX",
    zipCode: "78702",
    price: 675000,
    estimatedValue: 680000,
    daysOnMarket: 10,
    percentMatch: 89,
    squareFeet: 1950,
    pricePerSquareFoot: 346,
    beds: 3,
    baths: 2.5,
    yearBuilt: 2012,
    propertyType: "Townhouse",
    description:
      "Stylish townhouse in the vibrant East Austin neighborhood. Industrial-modern design with high ceilings, exposed brick, and custom finishes. Rooftop deck with city views.",
    aiSummary:
      "This East Austin townhouse is fairly priced at market value and offers a good match to your preferences at 89%. The property features a desirable rooftop deck and is located in a rapidly appreciating neighborhood. With 10 days on market, interest is likely high but you still have time to consider.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    location: {
      lat: 30.265,
      lng: -97.715,
    },
    features: [
      "Rooftop deck",
      "Exposed brick",
      "Custom lighting",
      "Quartz countertops",
      "Walk-in shower",
      "Electric car charging station",
    ],
    sellerDisclosure: {
      roofAge: 10,
      hvacAge: 5,
      waterHeaterAge: 2,
      knownIssues: ["Replaced dishwasher (2021)", "Repainted exterior (2022)"],
    },
  },
  {
    id: "6",
    address: "333 Maple Court",
    city: "Austin",
    state: "TX",
    zipCode: "78703",
    price: 1500000,
    estimatedValue: 1475000,
    daysOnMarket: 30,
    percentMatch: 78,
    squareFeet: 3800,
    pricePerSquareFoot: 395,
    beds: 5,
    baths: 4.5,
    yearBuilt: 1995,
    propertyType: "Single Family",
    description:
      "Elegant home in the prestigious Tarrytown neighborhood. Recently renovated with designer touches throughout. Large lot with mature trees, pool, and guest house.",
    aiSummary:
      "This Tarrytown property is slightly above our estimated market value and has been on the market for 30 days, suggesting potential negotiation opportunity. The 78% match is primarily due to the higher price point, but the property offers exceptional value with a guest house and pool on a large lot in a premium neighborhood.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    location: {
      lat: 30.295,
      lng: -97.77,
    },
    features: ["Swimming pool", "Guest house", "Wine cellar", "Home theater", "Outdoor fireplace", "Three-car garage"],
    sellerDisclosure: {
      roofAge: 8,
      hvacAge: 4,
      waterHeaterAge: 6,
      knownIssues: ["Pool resurfaced (2020)", "Tree removal in backyard (2021)", "Foundation repair (2015)"],
    },
  },
]

export const userPreferences = {
  priceRange: {
    min: 500000,
    max: 1000000,
  },
  beds: {
    min: 3,
    max: 5,
  },
  baths: {
    min: 2,
    max: null,
  },
  propertyTypes: ["Single Family", "Townhouse"],
  locations: [
    {
      name: "Downtown Austin",
      lat: 30.2672,
      lng: -97.7431,
    },
    {
      name: "South Congress",
      lat: 30.25,
      lng: -97.75,
    },
  ],
}

export const userActions = {
  offers: [
    {
      propertyId: "3",
      id: "offer1",
      offerPrice: 540000,
      downPayment: 108000,
      appraisalInfo: "Will cover up to $10,000 in appraisal gap",
      paymentMethod: "Mortgage" as const,
      closingDate: "2023-12-15",
      inspectionContingency: "Complete" as const,
      financingContingency: "Not Waived" as const,
      appraisalContingency: { limit: 10000 },
      additionalInfo: "Flexible on closing date if needed",
      status: "Accepted" as const,
    },
  ],
  likedProperties: ["1", "2", "5"],
  superLikedProperties: ["3"],
  scheduledVisits: [
    {
      propertyId: "1",
      date: "2023-11-10",
      startTime: "10:00 AM",
      endTime: "11:00 AM",
    },
    {
      propertyId: "5",
      date: "2023-11-12",
      startTime: "2:00 PM",
      endTime: "3:00 PM",
    },
  ],
}

