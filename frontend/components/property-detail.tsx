"use client"

import Image from "next/image"
import { useRouter } from "next/navigation"
import {
  Heart,
  Share2,
  Calendar,
  Send,
  Home,
  Info,
  Check,
  AlertTriangle,
  MapPin,
  Ruler,
  Clock,
  DollarSign,
  Droplet,
  Thermometer,
  Zap,
  Shield,
  ArrowLeft,
} from "lucide-react"
import type { Property } from "@/data/properties"
import { formatCurrency } from "@/utils/format"
import { useState } from "react"
import { useUIStateStore } from "@/lib/services/uiStateService"

interface PropertyDetailProps {
  property: Property
  isModal?: boolean
  backLink?: string
  backText?: string
}

export default function PropertyDetail({ property, isModal = false, backLink, backText }: PropertyDetailProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "details" | "disclosure">("overview")
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(property.liked || false)
  const router = useRouter()
  const { setPropertyDetailOpen } = useUIStateStore()

  const valuationDiff = property.estimatedValue - property.price
  const valuationPercentage = ((valuationDiff / property.price) * 100).toFixed(1)
  const isUndervalued = valuationDiff > 0

  const toggleLike = () => {
    setIsLiked(!isLiked)
  }

  const handleBack = () => {
    if (isModal) {
      setPropertyDetailOpen(false)
    } else if (backLink) {
      router.push(backLink)
    } else {
      router.back()
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden w-full">
      {/* Back button if not in modal */}
      {!isModal && backLink && (
        <div className="p-4">
          <button onClick={handleBack} className="inline-flex items-center text-neutral-600 hover:text-neutral-900">
            <ArrowLeft size={18} className="mr-2" />
            {backText || "Back"}
          </button>
        </div>
      )}

      {/* Image gallery */}
      <div className="relative">
        <div className="relative h-64 md:h-96 overflow-hidden">
          <Image
            src={property.images[activeImageIndex] || "/placeholder.svg?height=600&width=800"}
            alt={property.address}
            fill
            className="object-cover"
          />

          {/* Image navigation */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev === 0 ? property.images.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition-colors"
                aria-label="Previous image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev === property.images.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 text-white p-3 rounded-full hover:bg-black/60 transition-colors"
                aria-label="Next image"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
            </>
          )}

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
            {activeImageIndex + 1} / {property.images.length}
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <button className="bg-white/90 p-3 rounded-full hover:bg-white shadow-md transition-colors">
            <Share2 size={20} className="text-neutral-700" />
          </button>
          <button
            className={`p-3 rounded-full shadow-md transition-colors ${
              isLiked ? "bg-primary-500 text-white" : "bg-white/90 text-neutral-700 hover:bg-white"
            }`}
            onClick={toggleLike}
          >
            <Heart size={20} />
          </button>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">{property.address}</h1>
            <p className="text-neutral-600 flex items-center">
              <MapPin size={16} className="mr-1" />
              {property.city}, {property.state} {property.zipCode}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                {property.percentMatch}% Match
              </span>
              {property.originalPrice && property.originalPrice > property.price && (
                <span className="bg-success text-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                  {Math.round(((property.originalPrice - property.price) / property.originalPrice) * 100)}% Price Cut
                </span>
              )}
            </div>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-neutral-900">{formatCurrency(property.price)}</span>
              {property.originalPrice && property.originalPrice > property.price && (
                <span className="text-lg text-neutral-500 line-through ml-2">
                  {formatCurrency(property.originalPrice)}
                </span>
              )}
              <div className="ml-2 text-neutral-500 relative group">
                <Info size={18} className="cursor-pointer hover:text-primary-600" />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-lg p-3 hidden group-hover:block z-10">
                  <p className="font-medium mb-1">HomeGeeni Valuation</p>
                  <p className="mb-1">{formatCurrency(property.estimatedValue)}</p>
                  <p className={`text-sm ${isUndervalued ? "text-success" : "text-error"}`}>
                    {isUndervalued ? "+" : ""}
                    {formatCurrency(valuationDiff)} ({valuationPercentage}%)
                  </p>
                </div>
              </div>
            </div>
            <p className={`text-sm ${isUndervalued ? "text-success font-medium" : "text-error font-medium"}`}>
              {isUndervalued ? "Undervalued" : "Overvalued"} by {Math.abs(Number.parseFloat(valuationPercentage))}%
            </p>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="border-b border-neutral-200 mb-6">
          <div className="flex">
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === "overview"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-neutral-600 hover:text-neutral-900"
              }`}
              onClick={() => setActiveTab("overview")}
            >
              Overview
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === "details"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-neutral-600 hover:text-neutral-900"
              }`}
              onClick={() => setActiveTab("details")}
            >
              Property Details
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium border-b-2 ${
                activeTab === "disclosure"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-neutral-600 hover:text-neutral-900"
              }`}
              onClick={() => setActiveTab("disclosure")}
            >
              Seller's Disclosure
            </button>
          </div>
        </div>

        {/* Key details - always visible */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-neutral-50 p-3 rounded-lg flex items-center">
            <Home size={20} className="text-primary-500 mr-2" />
            <div>
              <p className="text-neutral-500 text-xs">Type</p>
              <p className="text-neutral-900 font-semibold">{property.propertyType}</p>
            </div>
          </div>
          <div className="bg-neutral-50 p-3 rounded-lg flex items-center">
            <Ruler size={20} className="text-primary-500 mr-2" />
            <div>
              <p className="text-neutral-500 text-xs">Square Feet</p>
              <p className="text-neutral-900 font-semibold">{property.squareFeet.toLocaleString()}</p>
            </div>
          </div>
          <div className="bg-neutral-50 p-3 rounded-lg flex items-center">
            <DollarSign size={20} className="text-primary-500 mr-2" />
            <div>
              <p className="text-neutral-500 text-xs">Price/sqft</p>
              <p className="text-neutral-900 font-semibold">${Math.round(property.pricePerSquareFoot)}</p>
            </div>
          </div>
          <div className="bg-neutral-50 p-3 rounded-lg flex items-center">
            <Clock size={20} className="text-primary-500 mr-2" />
            <div>
              <p className="text-neutral-500 text-xs">Days on Market</p>
              <p className="text-neutral-900 font-semibold">{property.daysOnMarket}</p>
            </div>
          </div>
        </div>

        <div className="max-h-[calc(100vh-500px)] overflow-y-auto pr-2">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              {/* Match and market info */}
              <div className="flex flex-wrap gap-4 mb-6">
                <div className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                  {property.percentMatch}% Match
                </div>
                <div className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm">
                  {property.beds} beds
                </div>
                <div className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm">
                  {property.baths} baths
                </div>
                <div className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm">
                  Built {property.yearBuilt}
                </div>
              </div>

              {/* AI Summary */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2 flex items-center">
                  <span className="bg-accent-400 text-white p-1 rounded mr-2">AI</span>
                  HomeGeeni Insights
                </h2>
                <div className="bg-accent-50 p-4 rounded-lg text-neutral-700 border-l-4 border-accent-400">
                  {property.aiSummary}
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Description</h2>
                <p className="text-neutral-700">{property.description}</p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Features</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {property.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-neutral-700">
                      <Check size={16} className="text-success mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Property Details Tab */}
          {activeTab === "details" && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h2 className="text-lg font-semibold mb-4">Interior Details</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">Bedrooms</span>
                      <span className="font-medium">{property.beds}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">Bathrooms</span>
                      <span className="font-medium">{property.baths}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">Total Square Feet</span>
                      <span className="font-medium">{property.squareFeet.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">Price per Square Foot</span>
                      <span className="font-medium">${Math.round(property.pricePerSquareFoot)}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">Flooring</span>
                      <span className="font-medium">Hardwood, Tile</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">Heating</span>
                      <span className="font-medium">Central</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">Cooling</span>
                      <span className="font-medium">Central A/C</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-4">Property Information</h2>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">Property Type</span>
                      <span className="font-medium">{property.propertyType}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">Year Built</span>
                      <span className="font-medium">{property.yearBuilt}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">Lot Size</span>
                      <span className="font-medium">0.25 acres</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">Parking</span>
                      <span className="font-medium">2-car garage</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">Days on Market</span>
                      <span className="font-medium">{property.daysOnMarket}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">MLS #</span>
                      <span className="font-medium">MLS12345678</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">Status</span>
                      <span className="font-medium">Active</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">Tax Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">Annual Tax Amount</span>
                      <span className="font-medium">{formatCurrency(property.price * 0.0125)}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">Tax Rate</span>
                      <span className="font-medium">1.25%</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">Last Assessment</span>
                      <span className="font-medium">{formatCurrency(property.price * 0.9)}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 pb-2">
                      <span className="text-neutral-600">Assessment Year</span>
                      <span className="font-medium">2022</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Seller's Disclosure Tab */}
          {activeTab === "disclosure" && (
            <div>
              <div className="bg-neutral-50 p-4 rounded-lg mb-6">
                <div className="flex items-start mb-4">
                  <AlertTriangle size={24} className="text-accent-500 mr-2 flex-shrink-0 mt-0.5" />
                  <p className="text-neutral-700 text-sm">
                    This seller's disclosure statement is a disclosure of the seller's knowledge of the condition of the
                    property as of the date signed by the seller. It is not a warranty of any kind by the seller or any
                    agent representing any party in this transaction.
                  </p>
                </div>

                <p className="text-neutral-700 text-sm mb-4">
                  Disclosure last updated: <span className="font-medium">June 15, 2023</span>
                </p>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Property Systems</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-neutral-800 mb-3 flex items-center">
                      <Thermometer size={18} className="text-primary-500 mr-2" />
                      HVAC System
                    </h3>
                    <div className="space-y-3 pl-7">
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-600">Age</span>
                        <span className="font-medium">{property.sellerDisclosure?.hvacAge} years</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-600">Type</span>
                        <span className="font-medium">Central heating and cooling</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-600">Last Serviced</span>
                        <span className="font-medium">March 2023</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-600">Known Issues</span>
                        <span className="font-medium">None</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-neutral-800 mb-3 flex items-center">
                      <Droplet size={18} className="text-primary-500 mr-2" />
                      Plumbing System
                    </h3>
                    <div className="space-y-3 pl-7">
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-600">Water Heater Age</span>
                        <span className="font-medium">{property.sellerDisclosure?.waterHeaterAge} years</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-600">Water Heater Type</span>
                        <span className="font-medium">Tankless</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-600">Water Source</span>
                        <span className="font-medium">Public</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-600">Known Issues</span>
                        <span className="font-medium">None</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Property Structure</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-medium text-neutral-800 mb-3 flex items-center">
                      <Home size={18} className="text-primary-500 mr-2" />
                      Roof
                    </h3>
                    <div className="space-y-3 pl-7">
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-600">Age</span>
                        <span className="font-medium">{property.sellerDisclosure?.roofAge} years</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-600">Material</span>
                        <span className="font-medium">Asphalt shingle</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-600">Last Inspected</span>
                        <span className="font-medium">April 2022</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-600">Known Issues</span>
                        <span className="font-medium">None</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-neutral-800 mb-3 flex items-center">
                      <Zap size={18} className="text-primary-500 mr-2" />
                      Electrical System
                    </h3>
                    <div className="space-y-3 pl-7">
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-600">Panel Type</span>
                        <span className="font-medium">Circuit breaker</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-600">Amperage</span>
                        <span className="font-medium">200 amps</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-600">Last Updated</span>
                        <span className="font-medium">2018</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 pb-2">
                        <span className="text-neutral-600">Known Issues</span>
                        <span className="font-medium">None</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Known Issues & Repairs</h2>
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <ul className="space-y-3">
                    {property.sellerDisclosure?.knownIssues.map((issue, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0 mt-0.5 mr-2">
                          <Shield size={16} className="text-primary-500" />
                        </div>
                        <span className="text-neutral-700">{issue}</span>
                      </li>
                    ))}
                    {property.sellerDisclosure?.knownIssues.length === 0 && (
                      <li className="flex items-center">
                        <Check size={16} className="text-success mr-2" />
                        <span className="text-neutral-700">No known issues reported by seller</span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action buttons - always visible */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 sticky bottom-0 bg-white pt-4 border-t border-neutral-100">
          <button
            onClick={() => router.push(`/property/${property.id}/visit`)}
            className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-primary-700 transition-colors"
          >
            <Calendar size={18} className="mr-2" />
            Schedule a Visit
          </button>
          <button
            onClick={() => router.push(`/property/${property.id}/offer`)}
            className="flex-1 bg-accent-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-accent-600 transition-colors"
          >
            <Send size={18} className="mr-2" />
            Send Offer
          </button>
        </div>
      </div>
    </div>
  )
}

