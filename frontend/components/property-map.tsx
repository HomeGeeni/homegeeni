"use client"

import { useState, useEffect, useRef } from "react"
import type { Property } from "@/data/types"

interface PropertyMapProps {
  properties: Property[]
  initialCenter?: { lat: number; lng: number }
  initialZoom?: number
  onBoundsChanged?: (bounds: any) => void
  onMarkerClick?: (property: Property) => void
}

// This is a placeholder for a real map component.
// In a real implementation, you would use a library like Google Maps, Mapbox, or Leaflet.
export default function PropertyMap({
  properties,
  initialCenter = { lat: 37.7749, lng: -122.4194 }, // San Francisco
  initialZoom = 12,
  onBoundsChanged,
  onMarkerClick,
}: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  // In a real implementation, you would initialize your map library here
  useEffect(() => {
    // Simulating a map loaded event
    const timer = setTimeout(() => {
      if (onBoundsChanged) {
        // Simulate bounds changed
        onBoundsChanged({
          north: initialCenter.lat + 0.1,
          south: initialCenter.lat - 0.1,
          east: initialCenter.lng + 0.1,
          west: initialCenter.lng - 0.1,
        })
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [initialCenter, onBoundsChanged])

  const handleMarkerClick = (property: Property) => {
    setSelectedProperty(property)
    if (onMarkerClick) {
      onMarkerClick(property)
    }
  }

  return (
    <div className="relative w-full h-full bg-neutral-100 rounded-lg overflow-hidden">
      <div ref={mapRef} className="w-full h-full relative">
        {/* This would be your actual map component */}
        <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
          <p className="text-center">Interactive Map</p>
          <p className="text-center text-sm">(Placeholder for actual map implementation)</p>
        </div>

        {/* Property markers */}
        {properties.map((property) => (
          <div
            key={property.id}
            className={`absolute w-6 h-6 transform -translate-x-1/2 -translate-y-1/2 
              ${selectedProperty?.id === property.id ? "bg-primary-600 z-10" : "bg-error hover:bg-primary-500"} 
              rounded-full cursor-pointer flex items-center justify-center text-white text-xs transition-all`}
            style={{
              left: `${((property.location.lng - (initialCenter.lng - 0.1)) / 0.2) * 100}%`,
              top: `${100 - ((property.location.lat - (initialCenter.lat - 0.1)) / 0.2) * 100}%`,
            }}
            onClick={() => handleMarkerClick(property)}
          >
            ${Math.round(property.price / 1000)}k
          </div>
        ))}
      </div>
    </div>
  )
}

