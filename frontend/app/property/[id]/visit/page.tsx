"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { properties } from "@/data/properties"
import { Calendar, Clock, ArrowLeft, Check, MessageSquare } from "lucide-react"
import Link from "next/link"
import { useModeStore } from "@/lib/services/modeService"
import { formatDate } from "@/utils/format"

export default function ScheduleVisitPage() {
  const params = useParams()
  const router = useRouter()
  const { mode } = useModeStore()
  const propertyId = params.id as string

  const property = properties.find((p) => p.id === propertyId)

  // Redirect if in seller mode
  useEffect(() => {
    if (mode === "seller") {
      router.push("/seller")
    }
  }, [mode, router])

  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [feedback, setFeedback] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Generate available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i + 1)
    return date.toISOString().split("T")[0]
  })

  // Generate available times
  const availableTimes = [
    "9:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "1:00 PM",
    "2:00 PM",
    "3:00 PM",
    "4:00 PM",
    "5:00 PM",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Redirect back to property page after 2 seconds
      setTimeout(() => {
        router.push(`/actions`)
      }, 2000)
    }, 1500)
  }

  if (!property) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Property Not Found</h1>
        <p className="text-neutral-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Link href="/buyer" className="text-primary-600 font-medium hover:underline">
          Back to Home
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-2xl">
      <Link
        href={`/property/${propertyId}`}
        className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Property
      </Link>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Schedule a Visit</h1>
          <p className="text-neutral-600 mb-6">
            {property.address}, {property.city}, {property.state}
          </p>

          {isSuccess ? (
            <div className="bg-success/10 text-success p-4 rounded-lg flex items-start">
              <Check size={24} className="mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg">Visit Scheduled!</h3>
                <p>
                  Your visit has been scheduled for {formatDate(selectedDate)} at {selectedTime}. We'll send you a
                  confirmation email with all the details.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-neutral-700 font-medium mb-2">Select a Date</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableDates.map((date) => {
                    const formattedDate = new Date(date).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                    })

                    return (
                      <button
                        key={date}
                        type="button"
                        className={`p-3 rounded-lg border text-center ${
                          selectedDate === date
                            ? "bg-primary-100 border-primary-500 text-primary-700"
                            : "border-neutral-200 hover:border-primary-300"
                        }`}
                        onClick={() => setSelectedDate(date)}
                      >
                        <Calendar size={16} className="mx-auto mb-1" />
                        <span className="text-sm">{formattedDate}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-neutral-700 font-medium mb-2">Select a Time</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {availableTimes.map((time) => (
                    <button
                      key={time}
                      type="button"
                      className={`p-3 rounded-lg border text-center ${
                        selectedTime === time
                          ? "bg-primary-100 border-primary-500 text-primary-700"
                          : "border-neutral-200 hover:border-primary-300"
                      }`}
                      onClick={() => setSelectedTime(time)}
                    >
                      <Clock size={16} className="mx-auto mb-1" />
                      <span className="text-sm">{time}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-neutral-700 font-medium mb-2">
                  <div className="flex items-center">
                    <MessageSquare size={16} className="mr-2" />
                    Message to Seller (Optional)
                  </div>
                </label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Let the seller know about any specific areas you'd like to see or questions you have about the property..."
                  rows={4}
                ></textarea>
              </div>

              <button
                type="submit
"
                disabled={!selectedDate || !selectedTime || isSubmitting}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-primary-700 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                    Scheduling Visit...
                  </>
                ) : (
                  "Schedule Visit"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

