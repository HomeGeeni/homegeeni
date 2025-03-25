"use client"

import { useState, useEffect, useRef } from "react"
import type { Property } from "@/data/properties"
import { formatCurrency } from "@/utils/format"

interface MapViewProps {
  properties: Property[]
  onPropertySelect: (property: Property) => void
  selectedProperty?: Property
}

export default function MapView({ properties, onPropertySelect, selectedProperty }: MapViewProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [hoveredProperty, setHoveredProperty] = useState<Property | null>(null)

  // This is a placeholder for actual map implementation
  // In a real app, you would use a library like Google Maps, Mapbox, or Leaflet
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsMapLoaded(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="relative w-full h-full min-h-[400px] bg-neutral-100 rounded-lg overflow-hidden shadow-md">
      <div ref={mapRef} className="w-full h-full">
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        )}

        {isMapLoaded && (
          <div className="relative w-full h-full">
            {/* Placeholder map background with a more realistic look */}
            <div className="absolute inset-0 bg-[#E8F4F8]">
              {/* Grid lines to simulate a map */}
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, rgba(200, 220, 240, 0.5) 1px, transparent 1px), linear-gradient(to bottom, rgba(200, 220, 240, 0.5) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              >
                {/* Simulate water */}
                <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-[#B3D9E9] opacity-50"></div>

                {/* Simulate roads */}
                <div className="absolute top-1/4 left-0 right-0 h-1 bg-[#FFC107] opacity-70"></div>
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#FFC107] opacity-70"></div>
                <div className="absolute top-0 bottom-0 left-1/4 w-1 bg-[#FFC107] opacity-70"></div>
                <div className="absolute top-0 bottom-0 left-3/4 w-1 bg-[#FFC107] opacity-70"></div>

                {/* Simulate parks */}
                <div className="absolute top-1/3 left-1/3 w-1/6 h-1/6 bg-[#8BC34A] opacity-40 rounded-full"></div>
                <div className="absolute bottom-1/3 right-1/4 w-1/8 h-1/8 bg-[#8BC34A] opacity-40 rounded-full"></div>
              </div>
            </div>

            {/* Property markers */}
            {properties.map((property) => {
              const isSelected = selectedProperty?.id === property.id
              const isHovered = hoveredProperty?.id === property.id

              // Determine marker color based on property status
              let markerColor = "bg-primary-500"
              if (property.liked) markerColor = "bg-primary-600"
              if (property.superLiked) markerColor = "bg-accent-500"

              return (
                <div
                  key={property.id}
                  className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${
                    isSelected || isHovered ? "z-10 scale-125" : "z-0"
                  }`}
                  style={{
                    left: `${((property.location.lng + 97.8) * 1000) % 100}%`,
                    top: `${((property.location.lat - 30.2) * 1000) % 100}%`,
                  }}
                  onMouseEnter={() => setHoveredProperty(property)}
                  onMouseLeave={() => setHoveredProperty(null)}
                >
                  <button
                    className={`w-10 h-10 rounded-full ${markerColor} text-white shadow-lg flex items-center justify-center border-2 border-white hover:scale-110 transition-transform`}
                    onClick={() => onPropertySelect(property)}
                    aria-label={`View ${property.address}`}
                  >
                    <span className="text-xs font-bold">${Math.round(property.price / 10000)}k</span>
                  </button>

                  {/* Tooltip on hover/selection */}
                  {(isHovered || isSelected) && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 bg-white rounded-lg shadow-lg p-2 min-w-[150px] pointer-events-none">
                      <div className="text-xs font-medium text-neutral-900 truncate">{property.address}</div>
                      <div className="text-xs text-neutral-600">
                        {property.beds} bd • {property.baths} ba
                      </div>
                      <div className="text-xs font-bold text-primary-600">{formatCurrency(property.price)}</div>

                      {/* Arrow pointing to marker */}
                      <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-3 h-3 bg-white rotate-45"></div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Map controls */}
      <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
        <button className="bg-white p-2 rounded-full shadow-md hover:bg-neutral-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="16"></line>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </button>
        <button className="bg-white p-2 rounded-full shadow-md hover:bg-neutral-50">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="8" y1="12" x2="16" y2="12"></line>
          </svg>
        </button>
      </div>

      {/* Map legend */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg shadow-md">
        <div className="text-xs font-medium text-neutral-900 mb-1">Property Types</div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary-500 mr-1"></div>
            <span className="text-xs">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-primary-600 mr-1"></div>
            <span className="text-xs">Liked</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-accent-500 mr-1"></div>
            <span className="text-xs">Super Liked</span>
          </div>
        </div>
      </div>
    </div>
  )
}

