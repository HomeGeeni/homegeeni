"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Building, Plus, Home, Calendar, Send, ArrowRight, Edit, Trash, Eye } from "lucide-react"
import { properties } from "@/data/properties"
import { formatCurrency } from "@/utils/format"
import { useModeStore } from "@/lib/services/modeService"
import { useRouter } from "next/navigation"
import { useUIStateStore } from "@/lib/services/uiStateService"

export default function SellerDashboardPage() {
  const [activeTab, setActiveTab] = useState<"properties" | "offers" | "visits">("properties")
  const { mode, setMode } = useModeStore()
  const router = useRouter()
  const { openConfirmationDialog } = useUIStateStore()

  // Redirect if in buyer mode
  useEffect(() => {
    if (mode === "buyer") {
      router.push("/buyer")
    }
  }, [mode, router])

  // Filter properties that belong to the seller
  const sellerProperties = properties.filter((property) => property.seller === "current_user")

  // Get offers for seller's properties
  const sellerOffers = sellerProperties.flatMap((property) => {
    return (property.offers || []).map((offer) => ({
      ...offer,
      property,
    }))
  })

  // Get visits for seller's properties
  const sellerVisits = sellerProperties.flatMap((property) => {
    return (property.visits || []).map((visit) => ({
      ...visit,
      property,
    }))
  })

  const handleDeleteProperty = (propertyId: string) => {
    openConfirmationDialog({
      title: "Delete Property",
      message: "Are you sure you want to delete this property? This action cannot be undone.",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        // In a real app, this would call an API to delete the property
        console.log("Property deleted:", propertyId)
      },
    })
  }

  const handleAcceptOffer = (offerId: string, propertyId: string) => {
    openConfirmationDialog({
      title: "Accept Offer",
      message:
        "Are you sure you want to accept this offer? Other offers for this property will be automatically rejected.",
      confirmText: "Yes, Accept Offer",
      cancelText: "Cancel",
      type: "info",
      onConfirm: () => {
        // In a real app, this would call an API to accept the offer
        console.log("Offer accepted:", offerId)
      },
    })
  }

  const handleCounterOffer = (offerId: string, propertyId: string) => {
    router.push(`/seller/property/${propertyId}/offer/${offerId}/counter`)
  }

  const handleRejectOffer = (offerId: string, propertyId: string) => {
    openConfirmationDialog({
      title: "Reject Offer",
      message: "Are you sure you want to reject this offer? Consider countering instead to keep the negotiation open.",
      confirmText: "Reject Offer",
      cancelText: "Cancel",
      type: "danger",
      onConfirm: () => {
        // In a real app, this would call an API to reject the offer
        console.log("Offer rejected:", offerId)
      },
    })
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4 md:mb-0">Seller Dashboard</h1>
        <Link
          href="/seller/property/new"
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-500 hover:bg-accent-600"
        >
          <Plus size={18} className="mr-2" />
          List New Property
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center mr-4">
              <Building size={24} className="text-primary-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Properties</h2>
              <p className="text-neutral-500">{sellerProperties.length} listed</p>
            </div>
          </div>
          <button
            className="text-primary-600 font-medium hover:underline flex items-center"
            onClick={() => setActiveTab("properties")}
          >
            View All
            <ArrowRight size={16} className="ml-1" />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center mr-4">
              <Send size={24} className="text-accent-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Offers</h2>
              <p className="text-neutral-500">{sellerOffers.length} received</p>
            </div>
          </div>
          <button
            className="text-accent-600 font-medium hover:underline flex items-center"
            onClick={() => setActiveTab("offers")}
          >
            View All
            <ArrowRight size={16} className="ml-1" />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mr-4">
              <Calendar size={24} className="text-success" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Scheduled Visits</h2>
              <p className="text-neutral-500">{sellerVisits.length} upcoming</p>
            </div>
          </div>
          <button
            className="text-success font-medium hover:underline flex items-center"
            onClick={() => setActiveTab("visits")}
          >
            View All
            <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="border-b border-neutral-200">
          <div className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "properties"
                  ? "text-accent-600 border-b-2 border-accent-600"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
              onClick={() => setActiveTab("properties")}
            >
              Your Properties
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "offers"
                  ? "text-accent-600 border-b-2 border-accent-600"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
              onClick={() => setActiveTab("offers")}
            >
              Offers
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === "visits"
                  ? "text-accent-600 border-b-2 border-accent-600"
                  : "text-neutral-600 hover:text-neutral-900"
              }`}
              onClick={() => setActiveTab("visits")}
            >
              Scheduled Visits
            </button>
          </div>
        </div>

        <div className="p-4">
          {/* Properties Tab */}
          {activeTab === "properties" && (
            <div>
              {sellerProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sellerProperties.map((property) => (
                    <div key={property.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={property.images[0] || "/placeholder.svg"}
                          alt={property.address}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-semibold">{property.address}</h3>
                          <p className="text-white/90 text-sm">
                            {property.city}, {property.state}
                          </p>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold text-lg">{formatCurrency(property.price)}</span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              property.status === "Active"
                                ? "bg-success/10 text-success"
                                : "bg-neutral-100 text-neutral-700"
                            }`}
                          >
                            {property.status}
                          </span>
                        </div>

                        <div className="flex justify-between text-sm text-neutral-600 mb-4">
                          <span>{property.beds} beds</span>
                          <span>{property.baths} baths</span>
                          <span>{property.squareFeet.toLocaleString()} sqft</span>
                        </div>

                        <div className="flex flex-col space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-neutral-600">Views</span>
                            <span className="font-medium">{property.stats?.views || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-neutral-600">Saved</span>
                            <span className="font-medium">{property.stats?.saved || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-neutral-600">Offers</span>
                            <span className="font-medium">{property.offers?.length || 0}</span>
                          </div>
                        </div>

                        <div className="border-t border-neutral-200 mt-4 pt-4 flex justify-between">
                          <Link
                            href={`/seller/property/${property.id}`}
                            className="text-accent-600 font-medium hover:underline flex items-center"
                          >
                            <Eye size={16} className="mr-1" />
                            View
                          </Link>
                          <Link
                            href={`/seller/property/${property.id}/edit`}
                            className="text-primary-600 font-medium hover:underline flex items-center"
                          >
                            <Edit size={16} className="mr-1" />
                            Edit
                          </Link>
                          <button
                            className="text-error font-medium hover:underline flex items-center"
                            onClick={() => handleDeleteProperty(property.id)}
                          >
                            <Trash size={16} className="mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <Home size={24} className="text-neutral-500" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No Properties Listed</h3>
                  <p className="text-neutral-600 mb-4">You haven't listed any properties for sale yet.</p>
                  <Link
                    href="/seller/property/new"
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-500 hover:bg-accent-600"
                  >
                    <Plus size={18} className="mr-2" />
                    List New Property
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Offers Tab */}
          {activeTab === "offers" && (
            <div>
              {sellerOffers.length > 0 ? (
                <div className="space-y-6">
                  {sellerOffers.map((offer) => (
                    <div key={offer.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                      <div className="p-4 bg-neutral-50 border-b border-neutral-200">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">{offer.property.address}</h3>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                              offer.status === "Accepted"
                                ? "bg-success/10 text-success"
                                : offer.status === "Pending"
                                  ? "bg-warning/10 text-warning"
                                  : offer.status === "Rejected"
                                    ? "bg-error/10 text-error"
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
                              src={offer.property.images[0] || "/placeholder.svg"}
                              alt={offer.property.address}
                              width={120}
                              height={80}
                              className="rounded-lg object-cover w-full md:w-32 h-20"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div>
                                <p className="text-neutral-500 text-sm">Offer Price</p>
                                <p className="font-semibold">{formatCurrency(offer.offerPrice)}</p>
                                <p className="text-xs text-neutral-500">
                                  {offer.offerPrice > offer.property.price
                                    ? `${Math.round(((offer.offerPrice - offer.property.price) / offer.property.price) * 100)}% above asking`
                                    : offer.offerPrice < offer.property.price
                                      ? `${Math.round(((offer.property.price - offer.offerPrice) / offer.property.price) * 100)}% below asking`
                                      : "At asking price"}
                                </p>
                              </div>
                              <div>
                                <p className="text-neutral-500 text-sm">List Price</p>
                                <p className="font-semibold">{formatCurrency(offer.property.price)}</p>
                              </div>
                              <div>
                                <p className="text-neutral-500 text-sm">Closing Date</p>
                                <p className="font-semibold">{new Date(offer.closingDate).toLocaleDateString()}</p>
                              </div>
                              <div>
                                <p className="text-neutral-500 text-sm">Payment</p>
                                <p className="font-semibold">{offer.paymentMethod}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="border-t border-neutral-200 pt-4">
                          <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-neutral-500 text-sm">Inspection Contingency</p>
                              <p className="font-medium">{offer.inspectionContingency}</p>
                            </div>
                            <div>
                              <p className="text-neutral-500 text-sm">Financing Contingency</p>
                              <p className="font-medium">{offer.financingContingency}</p>
                            </div>
                            <div>
                              <p className="text-neutral-500 text-sm">Appraisal Contingency</p>
                              <p className="font-medium">{offer.appraisalContingency}</p>
                            </div>
                            <div>
                              <p className="text-neutral-500 text-sm">Buyer</p>
                              <p className="font-medium">{offer.buyerName}</p>
                            </div>
                          </div>

                          {offer.status === "Pending" && (
                            <div className="flex flex-wrap gap-3 justify-end">
                              <button
                                className="px-4 py-2 bg-success text-white rounded-lg hover:bg-success/90"
                                onClick={() => handleAcceptOffer(offer.id, offer.property.id)}
                              >
                                Accept
                              </button>
                              <button
                                className="px-4 py-2 bg-accent-500 text-white rounded-lg hover:bg-accent-600"
                                onClick={() => handleCounterOffer(offer.id, offer.property.id)}
                              >
                                Counter
                              </button>
                              <button
                                className="px-4 py-2 bg-error text-white rounded-lg hover:bg-error/90"
                                onClick={() => handleRejectOffer(offer.id, offer.property.id)}
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <Send size={24} className="text-neutral-500" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No Offers Yet</h3>
                  <p className="text-neutral-600 mb-4">You haven't received any offers on your properties yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Visits Tab */}
          {activeTab === "visits" && (
            <div>
              {sellerVisits.length > 0 ? (
                <div className="space-y-4">
                  {sellerVisits.map((visit) => (
                    <div key={visit.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                      <div className="p-4 bg-neutral-50 border-b border-neutral-200">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold">{visit.property.address}</h3>
                          <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                            {new Date(visit.date).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <div className="flex flex-col md:flex-row">
                          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
                            <Image
                              src={visit.property.images[0] || "/placeholder.svg"}
                              alt={visit.property.address}
                              width={120}
                              height={80}
                              className="rounded-lg object-cover w-full md:w-32 h-20"
                            />
                          </div>
                          <div className="flex-grow">
                            <div className="flex items-center mb-3">
                              <Calendar size={18} className="text-primary-600 mr-2" />
                              <span className="font-medium">
                                {visit.startTime} - {visit.endTime}
                              </span>
                            </div>

                            <div className="mb-3">
                              <p className="text-neutral-500 text-sm mb-1">Visitor</p>
                              <p className="font-medium">{visit.visitorName}</p>
                            </div>

                            {visit.message && (
                              <div className="mb-3">
                                <p className="text-neutral-500 text-sm mb-1">Message</p>
                                <p className="text-neutral-700 bg-neutral-50 p-3 rounded-lg">{visit.message}</p>
                              </div>
                            )}

                            <div className="flex justify-end">
                              <Link
                                href={`/seller/property/${visit.property.id}/visit/${visit.id}`}
                                className="text-accent-600 font-medium hover:underline"
                              >
                                View Details
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                    <Calendar size={24} className="text-neutral-500" />
                  </div>
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No Scheduled Visits</h3>
                  <p className="text-neutral-600 mb-4">You don't have any scheduled property visits yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

