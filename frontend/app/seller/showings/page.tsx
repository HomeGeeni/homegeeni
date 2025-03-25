"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Calendar, Filter, Search, MessageSquare } from "lucide-react"
import { properties } from "@/data/properties"
import { formatDate } from "@/utils/format"
import { useModeStore } from "@/lib/services/modeService"

export default function ShowingsPage() {
  const router = useRouter()
  const { mode } = useModeStore()
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")
  const [searchQuery, setSearchQuery] = useState("")

  // Redirect if in buyer mode
  if (mode === "buyer") {
    router.push("/buyer")
    return null
  }

  // Mock data for showings
  const allShowings = properties.flatMap((property) => {
    // Generate 0-3 random showings per property
    const showingCount = Math.floor(Math.random() * 4)
    if (showingCount === 0) return []

    return Array.from({ length: showingCount }, (_, i) => {
      const today = new Date()
      const isPast = Math.random() > 0.5

      // Generate date (past or future)
      const showingDate = new Date()
      if (isPast) {
        // 1-14 days ago
        showingDate.setDate(today.getDate() - (1 + Math.floor(Math.random() * 14)))
      } else {
        // 1-14 days in future
        showingDate.setDate(today.getDate() + (1 + Math.floor(Math.random() * 14)))
      }

      const timeSlots = [
        "9:00 AM - 10:00 AM",
        "10:30 AM - 11:30 AM",
        "12:00 PM - 1:00 PM",
        "1:30 PM - 2:30 PM",
        "3:00 PM - 4:00 PM",
        "4:30 PM - 5:30 PM",
      ]

      return {
        id: `showing-${property.id}-${i}`,
        propertyId: property.id,
        property,
        buyerName: ["John Smith", "Sarah Johnson", "Michael Brown", "Emily Davis", "David Wilson"][
          Math.floor(Math.random() * 5)
        ],
        date: showingDate.toISOString().split("T")[0],
        time: timeSlots[Math.floor(Math.random() * timeSlots.length)],
        status: isPast ? "Completed" : "Scheduled",
        notes: isPast
          ? [
              "Liked the kitchen but concerned about the backyard size",
              "Very enthusiastic, asked about nearby schools",
              "Seemed interested but mentioned the price was a bit high",
              "Brought their contractor, spent extra time inspecting the foundation",
            ][Math.floor(Math.random() * 4)]
          : [
              "First-time homebuyer, very interested in the property",
              "Looking for a family home, has pre-approval letter",
              "Relocating from out of state, virtual tour scheduled",
              "Wants to see the property again with their designer",
            ][Math.floor(Math.random() * 4)],
      }
    })
  })

  // Filter showings based on active tab and search query
  const filteredShowings = allShowings.filter((showing) => {
    const matchesTab =
      (activeTab === "upcoming" && showing.status === "Scheduled") ||
      (activeTab === "past" && showing.status === "Completed")

    const matchesSearch =
      showing.property.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      showing.buyerName.toLowerCase().includes(searchQuery.toLowerCase())

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
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">Manage Showings</h1>

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
                  activeTab === "upcoming"
                    ? "border-accent-500 text-accent-600"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
                onClick={() => setActiveTab("upcoming")}
              >
                Upcoming ({allShowings.filter((s) => s.status === "Scheduled").length})
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 ${
                  activeTab === "past"
                    ? "border-accent-500 text-accent-600"
                    : "border-transparent text-neutral-600 hover:text-neutral-900"
                }`}
                onClick={() => setActiveTab("past")}
              >
                Past ({allShowings.filter((s) => s.status === "Completed").length})
              </button>
            </div>
          </div>

          {/* Showings List */}
          {filteredShowings.length > 0 ? (
            <div className="space-y-4">
              {filteredShowings.map((showing) => (
                <div
                  key={showing.id}
                  className={`border border-neutral-200 rounded-lg p-4 ${
                    showing.status === "Completed" ? "bg-neutral-50" : ""
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                    <div className="flex items-start">
                      <div className="h-12 w-12 flex-shrink-0 mr-3">
                        <Image
                          src={showing.property.images[0] || "/placeholder.svg?height=48&width=48"}
                          alt={showing.property.address}
                          width={48}
                          height={48}
                          className="rounded object-cover"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/seller/property/${showing.propertyId}`}
                          className="font-semibold text-primary-600 hover:underline"
                        >
                          {showing.property.address}
                        </Link>
                        <p className="text-sm text-neutral-500">
                          {showing.property.city}, {showing.property.state}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center mr-3">
                        <span className="text-primary-700 font-medium">{showing.buyerName.charAt(0)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{showing.buyerName}</h3>
                        <p className="text-sm text-neutral-500">
                          {formatDate(showing.date)}, {showing.time}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        showing.status === "Scheduled"
                          ? "bg-primary-100 text-primary-700"
                          : "bg-neutral-200 text-neutral-700"
                      }`}
                    >
                      {showing.status}
                    </span>
                  </div>

                  {showing.notes && (
                    <div className="mt-3 ml-15 text-sm text-neutral-600 border-t border-neutral-200 pt-3">
                      <p className="italic">"{showing.notes}"</p>
                    </div>
                  )}

                  {showing.status === "Scheduled" && (
                    <div className="flex justify-end space-x-3 mt-4">
                      <button className="px-4 py-2 border border-error text-error rounded-lg hover:bg-error/5">
                        Cancel
                      </button>
                      <button className="px-4 py-2 border border-warning text-warning rounded-lg hover:bg-warning/5">
                        Reschedule
                      </button>
                      <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
                        Confirm
                      </button>
                    </div>
                  )}

                  {showing.status === "Completed" && (
                    <div className="flex justify-end mt-4">
                      <button className="flex items-center text-primary-600 hover:text-primary-700">
                        <MessageSquare size={16} className="mr-1" />
                        Contact Buyer
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                <Calendar size={24} className="text-neutral-500" />
              </div>
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No {activeTab} Showings</h3>
              <p className="text-neutral-600 mb-4">
                {activeTab === "upcoming"
                  ? "You don't have any upcoming showings scheduled at this time."
                  : "You don't have any past showings to review."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

