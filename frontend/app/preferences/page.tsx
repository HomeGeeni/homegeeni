"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { userPreferences } from "@/data/properties"
import { Home, MapPin, Plus, X, HelpCircle, Check } from "lucide-react"
import Tooltip from "@/components/tooltip"
import RangeSlider from "@/components/range-slider"
import { formatCurrency } from "@/utils/format"
import { useModeStore } from "@/lib/services/modeService"
import { useRouter } from "next/navigation"

export default function PreferencesPage() {
  const [priceRange, setPriceRange] = useState(userPreferences.priceRange)
  const [beds, setBeds] = useState(userPreferences.beds)
  const [baths, setBaths] = useState(userPreferences.baths)
  const [propertyTypes, setPropertyTypes] = useState<string[]>(userPreferences.propertyTypes)
  const [locations, setLocations] = useState(userPreferences.locations)
  const [newLocation, setNewLocation] = useState("")
  const [tooltips, setTooltips] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { mode } = useModeStore()
  const router = useRouter()

  // Redirect if in seller mode
  useEffect(() => {
    if (mode === "seller") {
      router.push("/seller")
    }
  }, [mode, router])

  const toggleTooltip = (id: string) => {
    setTooltips((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handlePropertyTypeToggle = (type: string) => {
    if (propertyTypes.includes(type)) {
      setPropertyTypes(propertyTypes.filter((t) => t !== type))
    } else {
      setPropertyTypes([...propertyTypes, type])
    }
  }

  const handleAddLocation = () => {
    if (newLocation && locations.length < 5) {
      // In a real app, we would geocode the address to get lat/lng
      setLocations([
        ...locations,
        {
          name: newLocation,
          lat: 30.2672 + (Math.random() * 0.1 - 0.05),
          lng: -97.7431 + (Math.random() * 0.1 - 0.05),
        },
      ])
      setNewLocation("")
    }
  }

  const handleRemoveLocation = (index: number) => {
    setLocations(locations.filter((_, i) => i !== index))
  }

  const handlePriceRangeChange = (min: number, max: number) => {
    setPriceRange({ min, max })
  }

  const handleBedroomRangeChange = (min: number, max: number) => {
    setBeds({ min, max })
  }

  const handleBathroomRangeChange = (min: number, max: number) => {
    setBaths({ min, max })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    }, 1500)
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-3xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Your Preferences</h1>

      {isSuccess && (
        <div className="bg-success/10 text-success p-4 rounded-lg mb-6 flex items-center">
          <Check size={24} className="mr-3" />
          Preferences saved successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <label className="block text-neutral-700 font-medium">Price Range</label>
              <button
                type="button"
                className="ml-2 text-neutral-500"
                onClick={() => toggleTooltip("priceRange")}
                aria-label="Show information about price range"
              >
                <HelpCircle size={16} />
              </button>
              {tooltips.priceRange && (
                <Tooltip
                  content="Set your minimum and maximum budget for properties. This helps us find homes that match your financial preferences."
                  onClose={() => toggleTooltip("priceRange")}
                />
              )}
            </div>

            {/* Price Range Slider */}
            <RangeSlider
              min={100000}
              max={2000000}
              step={10000}
              minValue={priceRange.min}
              maxValue={priceRange.max}
              onChange={handlePriceRangeChange}
              formatValue={formatCurrency}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <div className="flex items-center mb-2">
                <label className="block text-neutral-700 font-medium">Bedrooms</label>
                <button
                  type="button"
                  className="ml-2 text-neutral-500"
                  onClick={() => toggleTooltip("bedrooms")}
                  aria-label="Show information about bedrooms"
                >
                  <HelpCircle size={16} />
                </button>
                {tooltips.bedrooms && (
                  <Tooltip
                    content="Select the minimum and maximum number of bedrooms you're looking for."
                    onClose={() => toggleTooltip("bedrooms")}
                  />
                )}
              </div>

              {/* Bedroom Range Slider */}
              <RangeSlider
                min={1}
                max={7}
                step={1}
                minValue={beds.min}
                maxValue={beds.max || 7}
                onChange={handleBedroomRangeChange}
                formatValue={(value) => (value === 7 ? "7+" : value.toString())}
              />
            </div>

            <div>
              <div className="flex items-center mb-2">
                <label className="block text-neutral-700 font-medium">Bathrooms</label>
                <button
                  type="button"
                  className="ml-2 text-neutral-500"
                  onClick={() => toggleTooltip("bathrooms")}
                  aria-label="Show information about bathrooms"
                >
                  <HelpCircle size={16} />
                </button>
                {tooltips.bathrooms && (
                  <Tooltip
                    content="Select the minimum and maximum number of bathrooms you're looking for."
                    onClose={() => toggleTooltip("bathrooms")}
                  />
                )}
              </div>

              {/* Bathroom Range Slider */}
              <RangeSlider
                min={1}
                max={5}
                step={0.5}
                minValue={baths.min}
                maxValue={baths.max || 5}
                onChange={handleBathroomRangeChange}
                formatValue={(value) => (value === 5 ? "5+" : value.toString())}
              />
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-2">
              <label className="block text-neutral-700 font-medium">Property Type</label>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                type="button"
                className={`p-3 rounded-lg border text-center ${
                  propertyTypes.includes("Single Family")
                    ? "bg-primary-100 border-primary-500 text-primary-700 font-medium"
                    : "border-neutral-200 hover:border-primary-300 text-neutral-700"
                }`}
                onClick={() => handlePropertyTypeToggle("Single Family")}
              >
                <Home size={20} className="mx-auto mb-1" />
                <span className="text-sm">Single Family</span>
              </button>
              <button
                type="button"
                className={`p-3 rounded-lg border text-center ${
                  propertyTypes.includes("Condo")
                    ? "bg-primary-100 border-primary-500 text-primary-700 font-medium"
                    : "border-neutral-200 hover:border-primary-300 text-neutral-700"
                }`}
                onClick={() => handlePropertyTypeToggle("Condo")}
              >
                <Home size={20} className="mx-auto mb-1" />
                <span className="text-sm">Condo</span>
              </button>
              <button
                type="button"
                className={`p-3 rounded-lg border text-center ${
                  propertyTypes.includes("Townhouse")
                    ? "bg-primary-100 border-primary-500 text-primary-700 font-medium"
                    : "border-neutral-200 hover:border-primary-300 text-neutral-700"
                }`}
                onClick={() => handlePropertyTypeToggle("Townhouse")}
              >
                <Home size={20} className="mx-auto mb-1" />
                <span className="text-sm">Townhouse</span>
              </button>
              <button
                type="button"
                className={`p-3 rounded-lg border text-center ${
                  propertyTypes.includes("Multi-Family")
                    ? "bg-primary-100 border-primary-500 text-primary-700 font-medium"
                    : "border-neutral-200 hover:border-primary-300 text-neutral-700"
                }`}
                onClick={() => handlePropertyTypeToggle("Multi-Family")}
              >
                <Home size={20} className="mx-auto mb-1" />
                <span className="text-sm">Multi-Family</span>
              </button>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <label className="block text-neutral-700 font-medium">Locations</label>
                <button
                  type="button"
                  className="ml-2 text-neutral-500"
                  onClick={() => toggleTooltip("locations")}
                  aria-label="Show information about locations"
                >
                  <HelpCircle size={16} />
                </button>
                {tooltips.locations && (
                  <Tooltip
                    content="Add up to 5 locations that you're interested in. These serve as 'anchors' for your search."
                    onClose={() => toggleTooltip("locations")}
                  />
                )}
              </div>
              <span className="text-sm text-neutral-500">{locations.length}/5</span>
            </div>

            <div className="flex mb-3">
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="Enter address, neighborhood, or city"
                className="flex-1 px-3 py-2 border border-neutral-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                disabled={locations.length >= 5}
              />
              <button
                type="button"
                onClick={handleAddLocation}
                disabled={!newLocation || locations.length >= 5}
                className="bg-primary-600 text-white px-4 py-2 rounded-r-lg hover:bg-primary-700 disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                <Plus size={20} />
              </button>
            </div>

            <div className="space-y-2">
              {locations.map((location, index) => (
                <div key={index} className="flex items-center justify-between bg-neutral-50 p-3 rounded-lg">
                  <div className="flex items-center">
                    <MapPin size={18} className="text-primary-500 mr-2" />
                    <span>{location.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveLocation(index)}
                    className="text-neutral-500 hover:text-error p-1 rounded-full hover:bg-neutral-100"
                    aria-label={`Remove ${location.name}`}
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}

              {locations.length === 0 && (
                <div className="text-center py-4 text-neutral-500 bg-neutral-50 rounded-lg">
                  No locations added yet. Add up to 5 locations above.
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-primary-700 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

