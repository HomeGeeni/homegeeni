import type { Property, User } from "./types"

export const properties: Property[] = [
  {
    id: "1",
    address: "123 Main Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94105",
    price: 1250000,
    estimatedValue: 1275000,
    daysOnMarket: 12,
    percentMatch: 92,
    sqft: 1850,
    pricePerSqft: 676,
    beds: 3,
    baths: 2.5,
    yearBuilt: 2010,
    propertyType: "Single Family",
    description:
      "Beautiful modern home in the heart of San Francisco with stunning views of the bay. Recently renovated with high-end finishes and smart home technology throughout.",
    aiSummary:
      "This property offers excellent value compared to similar homes in the area, with above-average square footage and modern amenities. The price per square foot is 5% below market average, and homes in this neighborhood typically appreciate 4.5% annually.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    location: {
      lat: 37.789,
      lng: -122.401,
    },
    features: [
      "Smart Home Technology",
      "Renovated Kitchen",
      "Hardwood Floors",
      "Fireplace",
      "Attached Garage",
      "Central AC",
      "Private Backyard",
    ],
    sellerDisclosure: "Roof was replaced in 2018. Water heater replaced in 2020. No known issues with the property.",
    status: "Active",
  },
  {
    id: "2",
    address: "456 Oak Drive",
    city: "San Francisco",
    state: "CA",
    zipCode: "94110",
    price: 1475000,
    estimatedValue: 1460000,
    daysOnMarket: 7,
    percentMatch: 89,
    sqft: 2100,
    pricePerSqft: 702,
    beds: 4,
    baths: 3,
    yearBuilt: 2005,
    propertyType: "Single Family",
    description:
      "Spacious family home in the popular Mission District with open concept design and abundant natural light. Beautifully landscaped yard and close to restaurants and shopping.",
    aiSummary:
      "This home is priced 1% above our estimated value, but offers more bedrooms than typical homes in the area. The location has excellent walkability and transit scores, and properties in this neighborhood have appreciated 5.1% annually over the past 5 years.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    location: {
      lat: 37.759,
      lng: -122.415,
    },
    features: [
      "Open Concept Floor Plan",
      "Chef's Kitchen",
      "Walk-in Closets",
      "Home Office",
      "Landscaped Yard",
      "Heated Floors",
      "Wine Cellar",
    ],
    sellerDisclosure: "Minor plumbing repair in master bathroom in 2021. Furnace serviced annually.",
    status: "Active",
  },
  {
    id: "3",
    address: "789 Pine Avenue",
    city: "San Francisco",
    state: "CA",
    zipCode: "94118",
    price: 995000,
    estimatedValue: 1050000,
    daysOnMarket: 21,
    percentMatch: 86,
    sqft: 1450,
    pricePerSqft: 686,
    beds: 2,
    baths: 2,
    yearBuilt: 1998,
    propertyType: "Condo",
    description:
      "Modern condo with high ceilings and an open floor plan. Renovated kitchen with quartz countertops and stainless steel appliances. Building includes gym and rooftop terrace.",
    aiSummary:
      "This condo is priced 5.2% below our estimated value, representing a potential opportunity. The unit is smaller than your preferences but offers excellent amenities. The building has low HOA fees compared to similar properties in the area.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    location: {
      lat: 37.782,
      lng: -122.46,
    },
    features: [
      "Quartz Countertops",
      "Stainless Steel Appliances",
      "In-unit Laundry",
      "Building Gym",
      "Rooftop Terrace",
      "Secure Parking",
      "Storage Unit",
    ],
    sellerDisclosure: "Building performed seismic upgrade in 2019. No special assessments planned.",
    status: "Active",
  },
  {
    id: "4",
    address: "101 Market Plaza",
    city: "San Francisco",
    state: "CA",
    zipCode: "94103",
    price: 1095000,
    estimatedValue: 1120000,
    daysOnMarket: 15,
    percentMatch: 94,
    sqft: 1600,
    pricePerSqft: 684,
    beds: 3,
    baths: 2,
    yearBuilt: 2012,
    propertyType: "Townhouse",
    description:
      "Stunning townhouse with high-end finishes and a private rooftop deck. Gourmet kitchen, luxurious primary suite, and smart home features throughout.",
    aiSummary:
      "This townhouse offers excellent value at 2.2% below our estimated fair market value. The property matches 94% of your preferences and is in a rapidly appreciating neighborhood with a 5-year growth rate of 6.2% annually.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    location: {
      lat: 37.775,
      lng: -122.413,
    },
    features: [
      "Rooftop Deck",
      "Gourmet Kitchen",
      "Smart Home System",
      "Primary Suite",
      "Home Office",
      "Energy Efficient",
      "Heated Floors",
    ],
    sellerDisclosure: "New water heater installed in 2022. HVAC system serviced annually.",
    status: "Active",
    liked: true,
  },
  {
    id: "5",
    address: "222 Elm Street",
    city: "San Francisco",
    state: "CA",
    zipCode: "94117",
    price: 1795000,
    estimatedValue: 1750000,
    daysOnMarket: 9,
    percentMatch: 81,
    sqft: 2500,
    pricePerSqft: 718,
    beds: 4,
    baths: 3.5,
    yearBuilt: 1932,
    propertyType: "Single Family",
    description:
      "Charming Victorian home with period details and modern updates. Gorgeous woodwork, bay windows, and a beautifully landscaped garden. Updated systems throughout.",
    aiSummary:
      "This Victorian home is priced 2.6% above our estimated value but offers unique historical features rarely available. The property is larger than most in the area and has been meticulously maintained, with all major systems updated in the past decade.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    location: {
      lat: 37.77,
      lng: -122.431,
    },
    features: [
      "Period Details",
      "Bay Windows",
      "Crown Molding",
      "Updated Kitchen",
      "Landscaped Garden",
      "Renovated Bathrooms",
      "Wine Cellar",
    ],
    sellerDisclosure: "Foundation bolted in 2015. Electrical updated in 2018. No known issues.",
    status: "Active",
  },
  {
    id: "6",
    address: "333 Cedar Lane",
    city: "San Francisco",
    state: "CA",
    zipCode: "94121",
    price: 1350000,
    estimatedValue: 1375000,
    daysOnMarket: 18,
    percentMatch: 85,
    sqft: 1900,
    pricePerSqft: 711,
    beds: 3,
    baths: 2,
    yearBuilt: 2001,
    propertyType: "Single Family",
    description:
      "Contemporary home with an open floor plan and abundant natural light. Gourmet kitchen, spacious primary suite, and lovely patio for outdoor entertaining.",
    aiSummary:
      "This property is priced 1.8% below our estimated value and matches most of your preferences. The neighborhood has excellent schools and the location provides easy access to parks and shopping.",
    images: [
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
      "/placeholder.svg?height=600&width=800",
    ],
    location: {
      lat: 37.779,
      lng: -122.495,
    },
    features: [
      "Open Floor Plan",
      "Gourmet Kitchen",
      "Outdoor Patio",
      "Home Office",
      "Hardwood Floors",
      "Recessed Lighting",
      "Gas Fireplace",
    ],
    sellerDisclosure: "Roof replaced in 2020. No known issues with the property.",
    status: "Active",
    superliked: true,
  },
]

export const currentUser: User = {
  id: "1",
  name: "Alex Johnson",
  email: "alex@example.com",
  phone: "(415) 555-1234",
  profileImage: "/placeholder.svg?height=200&width=200",
  preferences: {
    priceRange: {
      min: 900000,
      max: 1500000,
    },
    beds: {
      min: 2,
      max: 4,
    },
    baths: {
      min: 2,
      max: 3,
    },
    propertyTypes: ["Single Family", "Townhouse", "Condo"],
    locations: [
      {
        address: "San Francisco Downtown",
        lat: 37.7749,
        lng: -122.4194,
      },
      {
        address: "Mission District",
        lat: 37.7599,
        lng: -122.4148,
      },
    ],
  },
  savedProperties: ["4", "6"],
  viewedProperties: ["1", "2", "3", "4", "5", "6"],
  showings: [
    {
      id: "s1",
      propertyId: "4",
      date: new Date("2023-09-25"),
      startTime: "14:00",
      endTime: "15:00",
      notes: "Looking forward to seeing the rooftop deck",
      status: "Scheduled",
    },
  ],
  offers: [
    {
      id: "o1",
      propertyId: "6",
      offerPrice: 1325000,
      downPayment: 265000,
      appraisalContingency: {
        waived: false,
        limit: 1325000,
      },
      inspectionContingency: "Complete",
      financingContingency: false,
      paymentMethod: "Mortgage",
      closingDate: new Date("2023-10-30"),
      additionalNotes: "We love the home and are excited about the possibility of living there.",
      status: "Submitted",
      created: new Date("2023-09-15"),
      updated: new Date("2023-09-15"),
    },
  ],
}

export const showingTimes = [
  { date: new Date("2023-09-25"), times: ["10:00-11:00", "13:00-14:00", "14:00-15:00", "16:00-17:00"] },
  { date: new Date("2023-09-26"), times: ["09:00-10:00", "11:00-12:00", "15:00-16:00", "17:00-18:00"] },
  { date: new Date("2023-09-27"), times: ["10:00-11:00", "12:00-13:00", "14:00-15:00", "16:00-17:00"] },
  { date: new Date("2023-09-28"), times: ["11:00-12:00", "13:00-14:00", "15:00-16:00", "17:00-18:00"] },
  { date: new Date("2023-09-29"), times: ["09:00-10:00", "12:00-13:00", "14:00-15:00", "16:00-17:00"] },
]

export function getProperty(id: string): Property | undefined {
  return properties.find((property) => property.id === id)
}

export function getPropertiesInBounds(bounds: {
  north: number
  south: number
  east: number
  west: number
}): Property[] {
  return properties.filter((property) => {
    const { lat, lng } = property.location
    return lat <= bounds.north && lat >= bounds.south && lng <= bounds.east && lng >= bounds.west
  })
}

