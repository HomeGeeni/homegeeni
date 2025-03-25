"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, DollarSign, Filter, Search, MessageSquare } from "lucide-react"
import { properties } from "@/data/properties"
import { formatCurrency, formatDate } from "@/utils/format"
import { useModeStore } from "@/lib/services/modeService"

export default function OffersPage() {
  const router = useRouter()
  const { mode } = useModeStore()
  const [activeTab, setActiveTab] = useState<"pending" | "accepted" | "rejected">("pending")
  const [searchQuery, setSearchQuery] = useState("")

  // Redirect if in buyer mode
  if (mode === "buyer") {
    router.push("/buyer")
    return null
  }

  // Mock data for offers
  const allOffers = properties.flatMap((property) => {
    // Generate 0-3 random offers per property
    const offerCount = Math.floor(Math.random() * 4)
    if (offerCount === 0) return []

    return Array.from({ length: offerCount }, (_, i) => {
      const offerPrice = property.price * (0.9 + Math.random() * 0.15) // 90-105% of list price
      const statuses = ["Pending", "Accepted", "Rejected"] as const
      const randomStatusIndex = Math.floor(Math.random() * 3)

      return {
        id: `offer-${property.id}-${i}`,
        propertyId: property.id,
        property,
        buyerName: ["John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", "David Wilson"][
          Math.floor(Math.random() * 5)
        ],
        offerPrice: Math.round(offerPrice),
        downPayment: Math.round(offerPrice * (0.1 + Math.random() * 0.3)), // 10-40% down payment
        closingDate: new Date(Date.now() + (14 + Math.floor(Math.random() * 45)) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // 14-60 days from now
        status: statuses[randomStatusIndex],
        receivedDate: new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0], // 0-14 days ago
        contingencies: ["Financing", "Inspection", "Appraisal"].filter(() => Math.random() > 0.3), // Randomly include contingencies
      }
    })
  })

  // Filter offers based on active tab and search query
  const filteredOffers = allOffers.filter((offer) => {
    const matchesTab =
      (activeTab === "pending" && offer.status === "Pending") ||
      (activeTab === "accepted" && offer.status === "Accepted") ||
      (activeTab === "rejected" && offer.status === "Rejected")

    const matchesSearch =
      offer.property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      offer.buyerName.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesTab && matchesSearch
  })

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-5xl">
      <Link href="/seller" className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6">
        <ArrowLeft size={18} className="mr-2" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">Manage Offers</h1>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                placeholder="Search by property or buyer name..."
                className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <button className="px-4 py-2 border border-neutral-300 rounded-lg text-neutral-700 flex items-center hover:bg-neutral-50">
              <Filter size={18} className="mr-2" />
              Filter
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-neutral-200 mb-6">
            <div className="flex">
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "pending"
                    ? "border-accent-500 text-accent-600"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
                onClick={() => setActiveTab("pending")}
              >
                Pending ({allOffers.filter((o) => o.status === "Pending").length})
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "accepted"
                    ? "border-accent-500 text-accent-600"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
                onClick={() => setActiveTab("accepted")}
              >
                Accepted ({allOffers.filter((o) => o.status === "Accepted").length})
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "rejected"
                    ? "border-accent-500 text-accent-600"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
                onClick={() => setActiveTab("rejected")}
              >
                Rejected ({allOffers.filter((o) => o.status === "Rejected").length})
              </button>
            </div>
          </div>

          {/* Offers List */}
          {filteredOffers.length > 0 ? (
            <div className="space-y-6">
              {filteredOffers.map((offer) => (
                <div key={offer.id} className="border border-neutral-200 rounded-lg overflow-hidden">
                  <div className="p-4 bg-neutral-50 border-b border-neutral-200">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0 mr-3">
                          <Image
                            src={offer.property.images[0] || "/placeholder.svg?height=48&width=48"}
                            alt={offer.property.address}
                            width={48}
                            height={48}
                            className="rounded object-cover"
                          />
                        </div>
                        <div>
                          <Link
                            href={`/seller/property/${offer.propertyId}`}
                            className="font-semibold text-primary-600 hover:underline"
                          >
                            {offer.property.address}
                          </Link>
                          <p className="text-sm text-neutral-500">
                            {offer.property.city}, {offer.property.state}
                          </p>
                        </div>
                      </div>

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
                          {Math.round((offer.offerPrice / offer.property.price) * 100)}% of asking
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
                            <span key={index} className="bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded text-xs">
                              {contingency}
                            </span>
                          ))}
                          {offer.contingencies.length === 0 && <span className="text-neutral-500 text-xs">None</span>}
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
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No {activeTab} Offers</h3>
              <p className="text-neutral-600 mb-4">
                {activeTab === "pending"
                  ? "You don't have any pending offers to review at this time."
                  : activeTab === "accepted"
                    ? "You haven't accepted any offers yet."
                    : "You haven't rejected any offers yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

