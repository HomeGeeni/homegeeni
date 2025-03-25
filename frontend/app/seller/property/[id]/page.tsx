"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Edit, Calendar, DollarSign, Eye, Clock, Check, X, MessageSquare } from "lucide-react"
import { properties } from "@/data/properties"
import { formatCurrency, formatDate } from "@/utils/format"
import { useModeStore } from "@/lib/services/modeService"

export default function PropertyDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { mode } = useModeStore()
  const propertyId = params.id as string

  const [property, setProperty] = useState(null)
  const [activeTab, setActiveTab] = useState<"overview" | "offers" | "showings">("overview")

  useEffect(() => {
    if (propertyId) {
      const foundProperty = properties.find((p) => p.id === propertyId)
      setProperty(foundProperty)
    }
  }, [propertyId])

  // Redirect if in buyer mode
  if (mode === "buyer") {
    router.push("/buyer")
    return null
  }

  // Mock data for property insights
  const insights = {
    viewsTotal: 247,
    viewsLastWeek: 42,
    savedByUsers: 18,
    averageTimeOnPage: "2m 34s",
    similarProperties: {
      averagePrice: property ? property.price * 1.05 : 0,
      averageDaysOnMarket: 15,
    },
  }

  // Mock data for offers
  const offers = [
    {
      id: "offer1",
      buyerName: "John Smith",
      offerPrice: property ? property.price * 0.95 : 0,
      downPayment: property ? property.price * 0.95 * 0.2 : 0,
      closingDate: "2023-12-15",
      status: "Pending" as const,
      receivedDate: "2023-11-01",
      contingencies: ["Financing", "Inspection"],
    },
    {
      id: "offer2",
      buyerName: "Sarah Johnson",
      offerPrice: property ? property.price * 0.92 : 0,
      downPayment: property ? property.price * 0.92 * 0.25 : 0,
      closingDate: "2023-12-10",
      status: "Rejected" as const,
      receivedDate: "2023-10-28",
      contingencies: ["Financing", "Appraisal", "Inspection"],
    },
    {
      id: "offer3",
      buyerName: "Michael Brown",
      offerPrice: property ? property.price * 0.97 : 0,
      downPayment: property ? property.price * 0.97 * 0.3 : 0,
      closingDate: "2023-12-20",
      status: "Accepted" as const,
      receivedDate: "2023-11-05",
      contingencies: ["Inspection"],
    },
  ]

  // Mock data for showings
  const showings = [
    {
      id: "showing1",
      buyerName: "David Wilson",
      date: "2023-11-15",
      time: "10:00 AM - 11:00 AM",
      status: "Scheduled" as const,
      notes: "First-time homebuyer, very interested in the property",
    },
    {
      id: "showing2",
      buyerName: "Emily Davis",
      date: "2023-11-16",
      time: "2:00 PM - 3:00 PM",
      status: "Scheduled" as const,
      notes: "Looking for a family home, has pre-approval letter",
    },
    {
      id: "showing3",
      buyerName: "Robert Miller",
      date: "2023-11-10",
      time: "4:00 PM - 5:00 PM",
      status: "Completed" as const,
      notes: "Liked the kitchen but concerned about the backyard size",
    },
    {
      id: "showing4",
      buyerName: "Jennifer Taylor",
      date: "2023-11-08",
      time: "1:00 PM - 2:00 PM",
      status: "Completed" as const,
      notes: "Very enthusiastic, asked about nearby schools",
    },
  ]

  if (!property) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Property Not Found</h1>
        <p className="text-neutral-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Link href="/seller" className="text-primary-600 font-medium hover:underline">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-5xl">
      <Link href="/seller" className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6">
        <ArrowLeft size={18} className="mr-2" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Property Header */}
        <div className="relative h-64 md:h-80">
          <Image
            src={property.images[0] || "/placeholder.svg?height=600&width=800"}
            alt={property.address}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>

          <div className="absolute bottom-0 left-0 right-0 p-6">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{property.address}</h1>
                <p className="text-white/90">
                  {property.city}, {property.state} {property.zipCode}
                </p>
              </div>
              <Link
                href={`/seller/property/${property.id}/edit`}
                className="bg-white/90 text-neutral-700 px-4 py-2 rounded-lg flex items-center hover:bg-white transition-colors"
              >
                <Edit size={18} className="mr-2" />
                Edit Property
              </Link>
            </div>
          </div>
        </div>

        {/* Property Details */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
            <div>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-neutral-900">{formatCurrency(property.price)}</span>
                {property.originalPrice && property.originalPrice > property.price && (
                  <span className="text-sm text-neutral-500 line-through ml-2">
                    {formatCurrency(property.originalPrice)}
                  </span>
                )}
              </div>
              <p className="text-neutral-600">
                {property.beds} beds • {property.baths} baths • {property.squareFeet.toLocaleString()} sqft
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  !property.status || property.status === "Active"
                    ? "bg-success/10 text-success"
                    : property.status === "Pending"
                      ? "bg-warning/10 text-warning"
                      : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {property.status || "Active"}
              </span>
              <span className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm">
                {property.daysOnMarket} days on market
              </span>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-neutral-200 mb-6">
            <div className="flex">
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "overview"
                    ? "border-accent-500 text-accent-600"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
                onClick={() => setActiveTab("overview")}
              >
                Overview
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "offers"
                    ? "border-accent-500 text-accent-600"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
                onClick={() => setActiveTab("offers")}
              >
                Offers ({offers.filter((o) => o.status === "Pending").length})
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "showings"
                    ? "border-accent-500 text-accent-600"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
                onClick={() => setActiveTab("showings")}
              >
                Showings ({showings.filter((s) => s.status === "Scheduled").length})
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              {/* Property Insights */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Property Insights</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Eye size={18} className="text-primary-500 mr-2" />
                      <span className="text-neutral-600 text-sm">Total Views</span>
                    </div>
                    <p className="text-xl font-semibold">{insights.viewsTotal}</p>
                    <p className="text-xs text-neutral-500">+{insights.viewsLastWeek} last week</p>
                  </div>

                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <div className="flex items-center mb-1">
                      <DollarSign size={18} className="text-accent-500 mr-2" />
                      <span className="text-neutral-600 text-sm">Saved by Users</span>
                    </div>
                    <p className="text-xl font-semibold">{insights.savedByUsers}</p>
                    <p className="text-xs text-neutral-500">
                      {Math.round((insights.savedByUsers / insights.viewsTotal) * 100)}% of viewers
                    </p>
                  </div>

                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Clock size={18} className="text-secondary-500 mr-2" />
                      <span className="text-neutral-600 text-sm">Avg. Time on Page</span>
                    </div>
                    <p className="text-xl font-semibold">{insights.averageTimeOnPage}</p>
                    <p className="text-xs text-neutral-500">Higher than average</p>
                  </div>

                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <div className="flex items-center mb-1">
                      <Calendar size={18} className="text-primary-500 mr-2" />
                      <span className="text-neutral-600 text-sm">Days on Market</span>
                    </div>
                    <p className="text-xl font-semibold">{property.daysOnMarket}</p>
                    <p className="text-xs text-neutral-500">
                      {property.daysOnMarket < insights.similarProperties.averageDaysOnMarket
                        ? `${insights.similarProperties.averageDaysOnMarket - property.daysOnMarket} days less than average`
                        : `${property.daysOnMarket - insights.similarProperties.averageDaysOnMarket} days more than average`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Market Comparison */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Market Comparison</h2>
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <p className="text-neutral-600 mb-1">Your Price</p>
                      <p className="text-2xl font-semibold">{formatCurrency(property.price)}</p>
                    </div>

                    <div className="mb-4 md:mb-0">
                      <p className="text-neutral-600 mb-1">Average in Area</p>
                      <p className="text-2xl font-semibold">
                        {formatCurrency(insights.similarProperties.averagePrice)}
                      </p>
                    </div>

                    <div>
                      <p className="text-neutral-600 mb-1">Difference</p>
                      <p
                        className={`text-2xl font-semibold ${property.price < insights.similarProperties.averagePrice ? "text-success" : "text-error"}`}
                      >
                        {property.price < insights.similarProperties.averagePrice
                          ? `-${formatCurrency(insights.similarProperties.averagePrice - property.price)}`
                          : `+${formatCurrency(property.price - insights.similarProperties.averagePrice)}`}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Description</h2>
                <p className="text-neutral-700">{property.description}</p>
              </div>

              {/* Property Features */}
              <div>
                <h2 className="text-lg font-semibold mb-4">Features</h2>
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

          {/* Offers Tab */}
          {activeTab === "offers" && (
            <div>
              {offers.length > 0 ? (
                <div className="space-y-6">
                  {offers.map((offer) => (
                    <div key={offer.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                      <div className="p-4 bg-neutral-50 border-b border-neutral-200">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-primary-700 font-medium">{offer.buyerName.charAt(0)}</span>
                            </div>
                            <div>
                              <h3 className="font-semibold">{offer.buyerName}</h3>
                              <p className="text-sm text-neutral-500">Received {formatDate(offer.receivedDate)}</p>
                            </div>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              offer.status === "Accepted"
                                ? "bg-success/10 text-success"
                                : offer.status === "Pending"
                                  ? "bg-warning/10 text-warning"
                                  : "bg-error/10 text-error"
                            }`}
                          >
                            {offer.status}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div>
                            <p className="text-neutral-500 text-sm">Offer Price</p>
                            <p className="font-semibold">{formatCurrency(offer.offerPrice)}</p>
                            <p className="text-xs text-neutral-500">
                              {Math.round((offer.offerPrice / property.price) * 100)}% of asking
                            </p>
                          </div>
                          <div>
                            <p className="text-neutral-500 text-sm">Down Payment</p>
                            <p className="font-semibold">{formatCurrency(offer.downPayment)}</p>
                            <p className="text-xs text-neutral-500">
                              {Math.round((offer.downPayment / offer.offerPrice) * 100)}% of offer
                            </p>
                          </div>
                          <div>
                            <p className="text-neutral-500 text-sm">Closing Date</p>
                            <p className="font-semibold">{formatDate(offer.closingDate)}</p>
                          </div>
                          <div>
                            <p className="text-neutral-500 text-sm">Contingencies</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {offer.contingencies.map((contingency, index) => (
                                <span
                                  key={index}
                                  className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-xs"
                                >
                                  {contingency}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {offer.status === "Pending" && (
                          <div className="flex justify-end space-x-3 mt-4">
                            <button className="px-4 py-2 border border-error text-error rounded-lg hover:bg-error/5">
                              Reject
                            </button>
                            <button className="px-4 py-2 border border-warning text-warning rounded-lg hover:bg-warning/5">
                              Counter
                            </button>
                            <button className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90">
                              Accept
                            </button>
                          </div>
                        )}

                        {offer.status !== "Pending" && (
                          <div className="flex justify-end mt-4">
                            <button className="flex items-center text-primary-600 hover:text-primary-700">
                              <MessageSquare size={16} className="mr-1" />
                              Contact Buyer
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <DollarSign size={24} className="text-neutral-500" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No Offers Yet</h3>
                  <p className="text-neutral-600 mb-4">You haven't received any offers on this property yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Showings Tab */}
          {activeTab === "showings" && (
            <div>
              {showings.length > 0 ? (
                <div>
                  <div className="mb-6">
                    <h3 className="font-medium text-neutral-900 mb-3">Upcoming Showings</h3>
                    <div className="space-y-4">
                      {showings
                        .filter((showing) => showing.status === "Scheduled")
                        .map((showing) => (
                          <div key={showing.id} className="border border-neutral-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-primary-700 font-medium">{showing.buyerName.charAt(0)}</span>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">{showing.buyerName}</h4>
                                    <p className="text-sm text-neutral-500">
                                      {formatDate(showing.date)}, {showing.time}
                                    </p>
                                  </div>
                                </div>

                                {showing.notes && (
                                  <div className="mt-3 ml-13 text-sm text-neutral-600">
                                    <p className="italic">"{showing.notes}"</p>
                                  </div>
                                )}
                              </div>

                              <div className="flex space-x-2">
                                <button className="p-2 text-neutral-500 hover:text-error rounded-full hover:bg-neutral-100">
                                  <X size={18} />
                                </button>
                                <button className="p-2 text-neutral-500 hover:text-success rounded-full hover:bg-neutral-100">
                                  <Check size={18} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-medium text-neutral-900 mb-3">Past Showings</h3>
                    <div className="space-y-4">
                      {showings
                        .filter((showing) => showing.status === "Completed")
                        .map((showing) => (
                          <div key={showing.id} className="border border-neutral-200 rounded-lg p-4 bg-neutral-50">
                            <div className="flex justify-between items-start">
                              <div>
                                <div className="flex items-center">
                                  <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center mr-3">
                                    <span className="text-neutral-700 font-medium">{showing.buyerName.charAt(0)}</span>
                                  </div>
                                  <div>
                                    <h4 className="font-semibold">{showing.buyerName}</h4>
                                    <p className="text-sm text-neutral-500">
                                      {formatDate(showing.date)}, {showing.time}
                                    </p>
                                  </div>
                                </div>

                                {showing.notes && (
                                  <div className="mt-3 ml-13 text-sm text-neutral-600">
                                    <p className="italic">"{showing.notes}"</p>
                                  </div>
                                )}
                              </div>

                              <div>
                                <span className="bg-neutral-200 text-neutral-700 px-2 py-1 rounded-full text-xs">
                                  Completed
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar size={24} className="text-neutral-500" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No Showings Yet</h3>
                  <p className="text-neutral-600 mb-4">You haven't scheduled any showings for this property yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

