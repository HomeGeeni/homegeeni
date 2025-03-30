"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, Send, Check, Clock, Home } from "lucide-react"
import { properties } from "@/data/properties"
import { userActions } from "@/data/properties"
import { formatCurrency, formatDate } from "@/utils/format"
import { useModeStore } from "@/lib/services/modeService"
import { useRouter, useSearchParams } from "next/navigation"
import { useUIStateStore } from "@/lib/services/uiStateService"

export default function ActionsPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<"offers" | "visits" | "liked">(
    (searchParams.get("tab") as "offers" | "visits" | "liked") || "offers"
  )
  const [isMobile, setIsMobile] = useState(false)
  const { mode, setMode } = useModeStore()
  const router = useRouter()
  const { openConfirmationDialog, setSelectedPropertyId, setPropertyDetailOpen } = useUIStateStore()

  // Set mode to buyer when the page loads
  useEffect(() => {
    setMode("buyer")
  }, [setMode])

  // Check if we're on mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Redirect if in seller mode
  useEffect(() => {
    if (mode === "seller") {
      router.push("/seller")
    }
  }, [mode, router])

  // Update URL when tab changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", activeTab)
    router.replace(`/actions?${params.toString()}`)
  }, [activeTab, router, searchParams])

  // Get properties with active offers
  const propertiesWithOffers = properties.filter((property) =>
    userActions.offers.some((offer) => offer.propertyId === property.id),
  )

  // Get properties with scheduled visits
  const propertiesWithVisits = properties.filter((property) =>
    userActions.scheduledVisits.some((visit) => visit.propertyId === property.id),
  )

  // Get liked properties
  const likedProperties = properties.filter((property) => userActions.likedProperties.includes(property.id))

  // Get super liked properties
  const superLikedProperties = properties.filter((property) => userActions.superLikedProperties.includes(property.id))

  const handleViewProperty = (propertyId: string) => {
    if (isMobile) {
      // Preserve the current tab in the URL when navigating to property page
      const params = new URLSearchParams(searchParams.toString())
      params.set("tab", activeTab)
      router.push(`/property/${propertyId}?from=actions&tab=${activeTab}`)
    } else {
      setSelectedPropertyId(propertyId)
      setPropertyDetailOpen(true)
    }
  }

  const handleRescheduleVisit = (propertyId: string) => {
    openConfirmationDialog({
      title: "Reschedule Visit",
      message: "Are you sure you want to reschedule this visit? You'll be redirected to select a new time.",
      confirmText: "Yes, Reschedule",
      cancelText: "Cancel",
      type: "info",
      onConfirm: () => {
        router.push(`/property/${propertyId}/visit`)
      },
    })
  }

  const handleCancelVisit = (propertyId: string) => {
    openConfirmationDialog({
      title: "Cancel Visit",
      message: "Are you sure you want to cancel this visit? This action cannot be undone.",
      confirmText: "Yes, Cancel Visit",
      cancelText: "Keep Visit",
      type: "danger",
      onConfirm: () => {
        // In a real app, this would call an API to cancel the visit
        console.log("Visit cancelled for property", propertyId)
      },
    })
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Your Actions</h1>

      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <div className="border-b border-neutral-200">
          <div className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "offers"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
              onClick={() => setActiveTab("offers")}
            >
              Offers
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "visits"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
              onClick={() => setActiveTab("visits")}
            >
              Scheduled Visits
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "liked"
                  ? "text-primary-600 border-b-2 border-primary-600"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
              onClick={() => setActiveTab("liked")}
            >
              Liked Properties
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Offers Tab */}
          {activeTab === "offers" && (
            <div>
              {propertiesWithOffers.length > 0 ? (
                <div className="space-y-6">
                  {propertiesWithOffers.map((property) => {
                    const offer = userActions.offers.find((o) => o.propertyId === property.id)
                    if (!offer) return null

                    return (
                      <div
                        key={property.id}
                        className="border border-neutral-200 rounded-lg overflow-hidden cursor-pointer hover:border-primary-300 transition-colors"
                        onClick={() => handleViewProperty(property.id)}
                      >
                        <div className="p-4 bg-neutral-50 border-b border-neutral-200">
                          <div className="flex justify-between items-center">
                            <h3 className="font-semibold">{property.address}</h3>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${
                                offer.status === "Accepted"
                                  ? "bg-success/10 text-success"
                                  : offer.status === "Pending"
                                    ? "bg-warning/10 text-warning"
                                    : "bg-neutral-100 text-neutral-700"
                              }`}
                            >
                              {offer.status}
                            </span>
                          </div>
                        </div>

                        <div className="p-4">
                          <div className="flex flex-col md:flex-row md:items-center mb-4">
                            <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                              <Image
                                src={property.images[0] || "/placeholder.svg"}
                                alt={property.address}
                                width={120}
                                height={80}
                                className="rounded-lg object-cover w-full md:w-32 h-20"
                              />
                            </div>
                            <div className="flex-grow">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                  <p className="text-neutral-500 text-sm">Your Offer</p>
                                  <p className="font-semibold">{formatCurrency(offer.offerPrice)}</p>
                                </div>
                                <div>
                                  <p className="text-neutral-500 text-sm">List Price</p>
                                  <p className="font-semibold">{formatCurrency(property.price)}</p>
                                </div>
                                <div>
                                  <p className="text-neutral-500 text-sm">Closing Date</p>
                                  <p className="font-semibold">{formatDate(offer.closingDate)}</p>
                                </div>
                                <div>
                                  <p className="text-neutral-500 text-sm">Payment</p>
                                  <p className="font-semibold">{offer.paymentMethod}</p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {offer.status === "Accepted" && (
                            <div className="mt-4 border-t border-neutral-200 pt-4">
                              <h4 className="font-medium mb-3">Next Steps</h4>
                              <div className="space-y-3">
                                <div className="flex items-start">
                                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success/20 flex items-center justify-center mr-3 mt-0.5">
                                    <Check size={14} className="text-success" />
                                  </div>
                                  <div>
                                    <p className="font-medium">Offer Accepted</p>
                                    <p className="text-sm text-neutral-500">
                                      Your offer was accepted on {formatDate(new Date().toISOString())}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-start">
                                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 flex items-center justify-center mr-3 mt-0.5">
                                    <Clock size={14} className="text-primary-600" />
                                  </div>
                                  <div>
                                    <p className="font-medium">Schedule Inspection</p>
                                    <p className="text-sm text-neutral-500">
                                      Schedule your home inspection within the next 7 days
                                    </p>
                                    <button className="text-sm text-primary-600 font-medium hover:underline mt-1 inline-block">
                                      Schedule Now
                                    </button>
                                  </div>
                                </div>

                                <div className="flex items-start">
                                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center mr-3 mt-0.5">
                                    <span className="text-xs font-medium text-neutral-600">3</span>
                                  </div>
                                  <div>
                                    <p className="font-medium">Secure Financing</p>
                                    <p className="text-sm text-neutral-500">
                                      Complete your mortgage application if using financing
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {offer.status === "Pending" && (
                            <div className="mt-4 flex justify-end">
                              <button
                                className="text-primary-600 font-medium hover:underline"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleViewProperty(property.id)
                                }}
                              >
                                View Details
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <Send size={24} className="text-neutral-500" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No Offers Yet</h3>
                  <p className="text-neutral-600 mb-4">You haven't made any offers on properties yet.</p>
                  <Link
                    href="/buyer"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Browse Properties
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Scheduled Visits Tab */}
          {activeTab === "visits" && (
            <div>
              {propertiesWithVisits.length > 0 ? (
                <div className="space-y-4">
                  {propertiesWithVisits.map((property) => {
                    const visit = userActions.scheduledVisits.find((v) => v.propertyId === property.id)
                    if (!visit) return null

                    return (
                      <div
                        key={property.id}
                        className="flex flex-col md:flex-row border border-neutral-200 rounded-lg overflow-hidden cursor-pointer hover:border-primary-300 transition-colors"
                        onClick={() => handleViewProperty(property.id)}
                      >
                        <div className="md:w-1/4 relative h-40 md:h-auto">
                          <Image
                            src={property.images[0] || "/placeholder.svg"}
                            alt={property.address}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="p-4 flex-1">
                          <h3 className="font-semibold mb-1">{property.address}</h3>
                          <p className="text-neutral-600 text-sm mb-3">
                            {property.city}, {property.state}
                          </p>

                          <div className="flex items-center mb-3">
                            <Calendar size={18} className="text-primary-600 mr-2" />
                            <span className="font-medium">
                              {formatDate(visit.date)}, {visit.startTime} - {visit.endTime}
                            </span>
                          </div>

                          <div className="flex flex-wrap gap-2 mb-4">
                            <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
                              {property.beds} beds
                            </span>
                            <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
                              {property.baths} baths
                            </span>
                            <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
                              {property.squareFeet} sqft
                            </span>
                            <span className="bg-neutral-100 text-neutral-700 px-2 py-1 rounded text-xs">
                              {formatCurrency(property.price)}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <button
                              className="text-primary-600 font-medium hover:underline"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleViewProperty(property.id)
                              }}
                            >
                              View Property
                            </button>

                            <div className="flex space-x-2">
                              <button
                                className="px-3 py-1 border border-neutral-300 rounded text-neutral-700 text-sm hover:bg-neutral-50"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRescheduleVisit(property.id)
                                }}
                              >
                                Reschedule
                              </button>
                              <button
                                className="px-3 py-1 border border-neutral-300 rounded text-neutral-700 text-sm hover:bg-neutral-50"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCancelVisit(property.id)
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar size={24} className="text-neutral-500" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No Scheduled Visits</h3>
                  <p className="text-neutral-600 mb-4">You haven't scheduled any property visits yet.</p>
                  <Link
                    href="/buyer"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Browse Properties
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Liked Properties Tab */}
          {activeTab === "liked" && (
            <div>
              {likedProperties.length > 0 || superLikedProperties.length > 0 ? (
                <div>
                  {superLikedProperties.length > 0 && (
                    <div className="mb-6">
                      <h3 className="font-medium text-neutral-900 mb-3">Super Liked Properties</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {superLikedProperties.map((property) => (
                          <div
                            key={property.id}
                            className="border border-neutral-200 rounded-lg overflow-hidden cursor-pointer hover:border-primary-300 transition-colors"
                            onClick={() => handleViewProperty(property.id)}
                          >
                            <div className="relative h-40">
                              <Image
                                src={property.images[0] || "/placeholder.svg"}
                                alt={property.address}
                                fill
                                className="object-cover"
                              />
                              <div className="absolute top-2 right-2 bg-primary-600 text-white px-2 py-1 rounded-full text-xs">
                                Super Liked
                              </div>
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium mb-1">{property.address}</h4>
                              <p className="text-neutral-600 text-sm mb-2">
                                {property.city}, {property.state}
                              </p>
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">{formatCurrency(property.price)}</span>
                                <span className="text-sm text-neutral-600">
                                  {property.beds} bd | {property.baths} ba
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <button
                                  className="text-primary-600 text-sm font-medium hover:underline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewProperty(property.id)
                                  }}
                                >
                                  View Details
                                </button>
                                <Link
                                  href={`/property/${property.id}/visit`}
                                  className="text-primary-600 text-sm font-medium hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Schedule Visit
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {likedProperties.length > 0 && (
                    <div>
                      <h3 className="font-medium text-neutral-900 mb-3">Liked Properties</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {likedProperties.map((property) => (
                          <div
                            key={property.id}
                            className="border border-neutral-200 rounded-lg overflow-hidden cursor-pointer hover:border-primary-300 transition-colors"
                            onClick={() => handleViewProperty(property.id)}
                          >
                            <div className="relative h-40">
                              <Image
                                src={property.images[0] || "/placeholder.svg"}
                                alt={property.address}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-3">
                              <h4 className="font-medium mb-1">{property.address}</h4>
                              <p className="text-neutral-600 text-sm mb-2">
                                {property.city}, {property.state}
                              </p>
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-semibold">{formatCurrency(property.price)}</span>
                                <span className="text-sm text-neutral-600">
                                  {property.beds} bd | {property.baths} ba
                                </span>
                              </div>
                              <div className="flex justify-between">
                                <button
                                  className="text-primary-600 text-sm font-medium hover:underline"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewProperty(property.id)
                                  }}
                                >
                                  View Details
                                </button>
                                <Link
                                  href={`/property/${property.id}/visit`}
                                  className="text-primary-600 text-sm font-medium hover:underline"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Schedule Visit
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <Home size={24} className="text-neutral-500" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No Liked Properties</h3>
                  <p className="text-neutral-600 mb-4">You haven't liked any properties yet.</p>
                  <Link
                    href="/buyer"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
                  >
                    Browse Properties
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

