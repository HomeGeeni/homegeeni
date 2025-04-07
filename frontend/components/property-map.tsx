"use client"

import { useState, useEffect, useRef } from "react"
import mapboxgl from "mapbox-gl"
import "mapbox-gl/dist/mapbox-gl.css"
import type { Property } from "@/data/properties"
import { formatCurrency } from "@/utils/format"

// Initialize Mapbox access token
const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN
if (!mapboxToken) {
  console.error("Mapbox access token is not set. Please check your .env.local file.")
} else {
  mapboxgl.accessToken = mapboxToken
}

interface PropertyMapProps {
  properties: Property[]
  onPropertySelect: (property: Property) => void
  selectedProperty?: Property
  className?: string
}

export default function PropertyMap({
  properties,
  onPropertySelect,
  selectedProperty,
  className = "",
}: PropertyMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markers = useRef<mapboxgl.Marker[]>([])
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) {
      setMapError("Map initialization failed. Please check your Mapbox access token.")
      return
    }

    try {
      // Initialize map
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-97.7431, 30.2672], // Austin, TX coordinates
        zoom: 12,
      })

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), "top-right")

      // Handle map load
      map.current.on("load", () => {
        setIsMapLoaded(true)
      })

      // Handle map errors
      map.current.on("error", (e) => {
        console.error("Mapbox error:", e)
        setMapError("Failed to load map. Please try again later.")
      })
    } catch (error) {
      console.error("Map initialization error:", error)
      setMapError("Failed to initialize map. Please check your Mapbox access token.")
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  // Update markers when properties or selected property changes
  useEffect(() => {
    if (!map.current || !isMapLoaded) return

    // Remove existing markers
    markers.current.forEach((marker) => marker.remove())
    markers.current = []

    // Add new markers
    properties.forEach((property) => {
      const isSelected = selectedProperty?.id === property.id
      const markerColor = property.superLiked
        ? "#FF6B6B" // accent color for super liked
        : property.liked
        ? "#4F46E5" // primary-600 for liked
        : "#3B82F6" // primary-500 for regular

      const el = document.createElement("div")
      el.className = "w-10 h-10 rounded-full shadow-lg flex items-center justify-center border-2 border-white"
      el.style.backgroundColor = markerColor
      el.style.transform = isSelected ? "scale(1.25)" : "scale(1)"
      el.style.transition = "transform 0.2s ease"

      const priceText = document.createElement("span")
      priceText.className = "text-xs font-bold text-white"
      priceText.textContent = `$${Math.round(property.price / 10000)}k`
      el.appendChild(priceText)

      const marker = new mapboxgl.Marker({
        element: el,
        anchor: "bottom",
      })
        .setLngLat([property.location.lng, property.location.lat])
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="p-2">
              <h3 class="font-bold">${property.address}</h3>
              <p class="text-sm">${property.city}, ${property.state}</p>
              <p class="text-sm font-semibold">${formatCurrency(property.price)}</p>
            </div>
          `)
        )
        .addTo(map.current!)

      marker.getElement().addEventListener("click", () => {
        onPropertySelect(property)
      })

      markers.current.push(marker)
    })

    // Fit bounds to show all markers
    if (properties.length > 0) {
      const bounds = new mapboxgl.LngLatBounds()
      properties.forEach((property) => {
        bounds.extend([property.location.lng, property.location.lat])
      })
      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 15,
      })
    }
  }, [properties, selectedProperty, isMapLoaded, onPropertySelect])

  return (
    <div className={`relative w-full h-full rounded-lg overflow-hidden ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
      {!isMapLoaded && !mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      )}
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100">
          <div className="bg-white p-4 rounded-lg shadow-md max-w-sm text-center">
            <p className="text-error font-medium mb-2">Map Error</p>
            <p className="text-sm text-neutral-600">{mapError}</p>
          </div>
        </div>
      )}
    </div>
  )
}

