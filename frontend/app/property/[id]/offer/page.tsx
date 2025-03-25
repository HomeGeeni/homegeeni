"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { properties } from "@/data/properties"
import { ArrowLeft, HelpCircle, Check, Calendar, X, Info } from "lucide-react"
import Link from "next/link"
import Tooltip from "@/components/tooltip"
import { useModeStore } from "@/lib/services/modeService"
import { formatCurrency } from "@/utils/format"

export default function SendOfferPage() {
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

  const [offerPrice, setOfferPrice] = useState(property ? property.price : 0)
  const [downPayment, setDownPayment] = useState(offerPrice * 0.2)
  const [paymentMethod, setPaymentMethod] = useState<"Cash" | "Mortgage">("Mortgage")
  const [closingDate, setClosingDate] = useState("")
  const [inspectionContingency, setInspectionContingency] = useState<
    "Waived" | "Structural and Environmental" | "Complete"
  >("Complete")
  const [financingContingency, setFinancingContingency] = useState<"Waived" | "Not Waived">("Not Waived")
  const [appraisalContingency, setAppraisalContingency] = useState<"Waived" | "Not Waived">("Not Waived")
  const [appraisalGap, setAppraisalGap] = useState(10000)
  const [additionalInfo, setAdditionalInfo] = useState("")
  const [showCalendar, setShowCalendar] = useState(false)

  const [tooltips, setTooltips] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const toggleTooltip = (id: string) => {
    setTooltips((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Generate available closing dates (next 30-90 days)
  const today = new Date()
  const sellerPreferredEarliest = new Date(today)
  sellerPreferredEarliest.setDate(today.getDate() + 30)

  const sellerPreferredLatest = new Date(today)
  sellerPreferredLatest.setDate(today.getDate() + 60)

  const availableClosingDates = Array.from({ length: 90 }, (_, i) => {
    const date = new Date(today)
    date.setDate(date.getDate() + i + 15) // Start from 15 days from now
    return {
      date: date.toISOString().split("T")[0],
      isPreferred: date >= sellerPreferredEarliest && date <= sellerPreferredLatest,
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Redirect back to property page after 2 seconds
      setTimeout(() => {
        router.push(`/property/${propertyId}`)
      }, 2000)
    }, 1500)
  }

  // Format date for display
  const formatDateDisplay = (dateString: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  // Check if a date is in the seller's preferred window
  const isPreferredDate = (dateString: string) => {
    const date = new Date(dateString)
    return date >= sellerPreferredEarliest && date <= sellerPreferredLatest
  }

  // Generate calendar for date selection
  const generateCalendar = () => {
    const months: { [key: string]: Date[] } = {}

    availableClosingDates.forEach(({ date }) => {
      const dateObj = new Date(date)
      const monthKey = dateObj.toLocaleDateString("en-US", { month: "long", year: "numeric" })

      if (!months[monthKey]) {
        months[monthKey] = []
      }

      months[monthKey].push(dateObj)
    })

    return Object.entries(months).map(([monthName, dates]) => {
      // Get first day of month to calculate offset
      const firstDay = new Date(dates[0].getFullYear(), dates[0].getMonth(), 1)
      const dayOfWeek = firstDay.getDay() // 0 = Sunday, 1 = Monday, etc.

      // Create array of all days in the month
      const daysInMonth = new Date(dates[0].getFullYear(), dates[0].getMonth() + 1, 0).getDate()
      const allDays = Array.from({ length: daysInMonth }, (_, i) => {
        const day = new Date(dates[0].getFullYear(), dates[0].getMonth(), i + 1)
        return {
          date: day,
          isAvailable: dates.some((d) => d.getDate() === i + 1),
          isPreferred: day >= sellerPreferredEarliest && day <= sellerPreferredLatest,
        }
      })

      return (
        <div key={monthName} className="mb-6">
          <h3 className="text-lg font-medium mb-2">{monthName}</h3>
          <div className="grid grid-cols-7 gap-1">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center text-xs text-neutral-500 py-1">
                {day}
              </div>
            ))}

            {/* Empty cells for days before the first of the month */}
            {Array.from({ length: dayOfWeek }, (_, i) => (
              <div key={`empty-${i}`} className="h-10"></div>
            ))}

            {/* Calendar days */}
            {allDays.map(({ date, isAvailable, isPreferred }) => {
              const dateString = date.toISOString().split("T")[0]
              const isSelected = dateString === closingDate
              const isPast = date < today

              return (
                <button
                  key={dateString}
                  type="button"
                  disabled={!isAvailable || isPast}
                  onClick={() => {
                    setClosingDate(dateString)
                    setShowCalendar(false)
                  }}
                  className={`h-10 flex items-center justify-center rounded-md text-sm ${
                    isSelected
                      ? "bg-primary-600 text-white"
                      : isPreferred && isAvailable && !isPast
                        ? "bg-primary-100 text-primary-700 hover:bg-primary-200"
                        : isAvailable && !isPast
                          ? "hover:bg-neutral-100"
                          : "text-neutral-300 cursor-not-allowed"
                  }`}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )
    })
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
    <div className="container mx-auto p-4 md:p-6 max-w-3xl">
      <Link
        href={`/property/${propertyId}`}
        className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Property
      </Link>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Make an Offer</h1>
          <p className="text-neutral-600 mb-6">
            {property.address}, {property.city}, {property.state}
          </p>

          {isSuccess ? (
            <div className="bg-success/10 text-success p-4 rounded-lg flex items-start">
              <Check size={24} className="mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg">Offer Submitted!</h3>
                <p>
                  Your offer has been submitted to the seller. We'll notify you when they respond. You can view the
                  details of your offer on the property page.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex items-center mb-2">
                    <label className="block text-neutral-700 font-medium">Offer Price</label>
                    <button
                      type="button"
                      className="ml-2 text-neutral-500"
                      onClick={() => toggleTooltip("offerPrice")}
                      aria-label="Show information about offer price"
                    >
                      <HelpCircle size={16} />
                    </button>
                    {tooltips.offerPrice && (
                      <Tooltip
                        content={`The amount you're offering to pay for the property. The listing price is ${formatCurrency(property.price)}.`}
                        onClose={() => toggleTooltip("offerPrice")}
                      />
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">$</span>
                    <input
                      type="number"
                      value={offerPrice}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value)
                        setOfferPrice(value)
                        setDownPayment(value * 0.2)
                      }}
                      className="w-full pl-8 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center mb-2">
                    <label className="block text-neutral-700 font-medium">Down Payment</label>
                    <button
                      type="button"
                      className="ml-2 text-neutral-500"
                      onClick={() => toggleTooltip("downPayment")}
                      aria-label="Show information about down payment"
                    >
                      <HelpCircle size={16} />
                    </button>
                    {tooltips.downPayment && (
                      <Tooltip
                        content="The initial payment you'll make upfront. Typically 20% of the purchase price for conventional loans."
                        onClose={() => toggleTooltip("downPayment")}
                      />
                    )}
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">$</span>
                    <input
                      type="number"
                      value={downPayment}
                      onChange={(e) => setDownPayment(Number.parseInt(e.target.value))}
                      className="w-full pl-8 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <label className="block text-neutral-700 font-medium">Payment Method</label>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`p-3 rounded-lg border text-center ${
                      paymentMethod === "Cash"
                        ? "bg-primary-100 border-primary-500 text-primary-700"
                        : "border-neutral-200 hover:border-primary-300"
                    }`}
                    onClick={() => setPaymentMethod("Cash")}
                  >
                    Cash
                  </button>
                  <button
                    type="button"
                    className={`p-3 rounded-lg border text-center ${
                      paymentMethod === "Mortgage"
                        ? "bg-primary-100 border-primary-500 text-primary-700"
                        : "border-neutral-200 hover:border-primary-300"
                    }`}
                    onClick={() => setPaymentMethod("Mortgage")}
                  >
                    Mortgage
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <label className="block text-neutral-700 font-medium">Desired Closing Date</label>
                  <button
                    type="button"
                    className="ml-2 text-neutral-500"
                    onClick={() => toggleTooltip("closingDate")}
                    aria-label="Show information about closing date"
                  >
                    <HelpCircle size={16} />
                  </button>
                  {tooltips.closingDate && (
                    <Tooltip
                      content={`The date when you want to finalize the purchase. The seller prefers closing between ${formatDateDisplay(sellerPreferredEarliest.toISOString())} and ${formatDateDisplay(sellerPreferredLatest.toISOString())}.`}
                      onClose={() => toggleTooltip("closingDate")}
                    />
                  )}
                </div>

                <div className="relative">
                  <div
                    className={`flex items-center p-3 border ${
                      closingDate ? "border-primary-500" : "border-neutral-300"
                    } rounded-lg cursor-pointer`}
                    onClick={() => setShowCalendar(!showCalendar)}
                  >
                    <Calendar size={18} className="text-neutral-500 mr-2" />
                    <span className={closingDate ? "text-neutral-900" : "text-neutral-500"}>
                      {closingDate ? formatDateDisplay(closingDate) : "Select a closing date"}
                    </span>
                    {isPreferredDate(closingDate) && closingDate && (
                      <span className="ml-auto bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full">
                        Seller Preferred
                      </span>
                    )}
                  </div>

                  {showCalendar && (
                    <div className="absolute z-20 mt-2 p-4 bg-white rounded-lg shadow-xl border border-neutral-200 w-full max-h-96 overflow-y-auto">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium">Select Closing Date</h3>
                        <button
                          type="button"
                          className="text-neutral-500 hover:text-neutral-700"
                          onClick={() => setShowCalendar(false)}
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="mb-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
                        <div className="flex items-start">
                          <Info size={18} className="text-primary-600 mr-2 flex-shrink-0 mt-0.5" />
                          <p className="text-sm text-neutral-700">
                            <span className="font-medium">Seller's preferred closing window:</span>{" "}
                            {formatDateDisplay(sellerPreferredEarliest.toISOString())} -{" "}
                            {formatDateDisplay(sellerPreferredLatest.toISOString())}
                          </p>
                        </div>
                      </div>

                      {generateCalendar()}
                    </div>
                  )}
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <label className="block text-neutral-700 font-medium">Inspection Contingency</label>
                  <button
                    type="button"
                    className="ml-2 text-neutral-500"
                    onClick={() => toggleTooltip("inspection")}
                    aria-label="Show information about inspection contingency"
                  >
                    <HelpCircle size={16} />
                  </button>
                  {tooltips.inspection && (
                    <Tooltip
                      content="Allows you to back out of the deal or renegotiate if inspections reveal issues with the property."
                      onClose={() => toggleTooltip("inspection")}
                    />
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <button
                    type="button"
                    className={`p-3 rounded-lg border text-center ${
                      inspectionContingency === "Waived"
                        ? "bg-primary-100 border-primary-500 text-primary-700"
                        : "border-neutral-200 hover:border-primary-300"
                    }`}
                    onClick={() => setInspectionContingency("Waived")}
                  >
                    Waived
                  </button>
                  <button
                    type="button"
                    className={`p-3 rounded-lg border text-center ${
                      inspectionContingency === "Structural and Environmental"
                        ? "bg-primary-100 border-primary-500 text-primary-700"
                        : "border-neutral-200 hover:border-primary-300"
                    }`}
                    onClick={() => setInspectionContingency("Structural and Environmental")}
                  >
                    Structural & Environmental Only
                  </button>
                  <button
                    type="button"
                    className={`p-3 rounded-lg border text-center ${
                      inspectionContingency === "Complete"
                        ? "bg-primary-100 border-primary-500 text-primary-700"
                        : "border-neutral-200 hover:border-primary-300"
                    }`}
                    onClick={() => setInspectionContingency("Complete")}
                  >
                    Complete
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <label className="block text-neutral-700 font-medium">Financing Contingency</label>
                  <button
                    type="button"
                    className="ml-2 text-neutral-500"
                    onClick={() => toggleTooltip("financing")}
                    aria-label="Show information about financing contingency"
                  >
                    <HelpCircle size={16} />
                  </button>
                  {tooltips.financing && (
                    <Tooltip
                      content="Protects you if you're unable to secure financing. Only relevant if you're using a mortgage."
                      onClose={() => toggleTooltip("financing")}
                    />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    className={`p-3 rounded-lg border text-center ${
                      financingContingency === "Waived"
                        ? "bg-primary-100 border-primary-500 text-primary-700"
                        : "border-neutral-200 hover:border-primary-300"
                    }`}
                    onClick={() => setFinancingContingency("Waived")}
                    disabled={paymentMethod === "Cash"}
                  >
                    Waived
                  </button>
                  <button
                    type="button"
                    className={`p-3 rounded-lg border text-center ${
                      financingContingency === "Not Waived"
                        ? "bg-primary-100 border-primary-500 text-primary-700"
                        : "border-neutral-200 hover:border-primary-300"
                    }`}
                    onClick={() => setFinancingContingency("Not Waived")}
                    disabled={paymentMethod === "Cash"}
                  >
                    Not Waived
                  </button>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center mb-2">
                  <label className="block text-neutral-700 font-medium">Appraisal Contingency</label>
                  <button
                    type="button"
                    className="ml-2 text-neutral-500"
                    onClick={() => toggleTooltip("appraisal")}
                    aria-label="Show information about appraisal contingency"
                  >
                    <HelpCircle size={16} />
                  </button>
                  {tooltips.appraisal && (
                    <Tooltip
                      content="Protects you if the property appraises for less than your offer price. You can set a limit on how much you're willing to cover."
                      onClose={() => toggleTooltip("appraisal")}
                    />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button
                    type="button"
                    className={`p-3 rounded-lg border text-center ${
                      appraisalContingency === "Waived"
                        ? "bg-primary-100 border-primary-500 text-primary-700"
                        : "border-neutral-200 hover:border-primary-300"
                    }`}
                    onClick={() => setAppraisalContingency("Waived")}
                  >
                    Waived
                  </button>
                  <button
                    type="button"
                    className={`p-3 rounded-lg border text-center ${
                      appraisalContingency === "Not Waived"
                        ? "bg-primary-100 border-primary-500 text-primary-700"
                        : "border-neutral-200 hover:border-primary-300"
                    }`}
                    onClick={() => setAppraisalContingency("Not Waived")}
                  >
                    Not Waived
                  </button>
                </div>

                {appraisalContingency === "Not Waived" && (
                  <div>
                    <label className="block text-neutral-700 text-sm mb-2">
                      Appraisal Gap Coverage (how much you're willing to pay above appraised value)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">$</span>
                      <input
                        type="number"
                        value={appraisalGap}
                        onChange={(e) => setAppraisalGap(Number.parseInt(e.target.value))}
                        className="w-full pl-8 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-neutral-700 font-medium mb-2">Additional Information</label>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  placeholder="Add any additional terms or information you'd like to include with your offer..."
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={!closingDate || isSubmitting}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-primary-700 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                    Submitting Offer...
                  </>
                ) : (
                  "Submit Offer"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

