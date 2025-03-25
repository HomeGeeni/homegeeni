"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Map, X, Heart, Star, ArrowLeft } from "lucide-react"
import { properties } from "@/data/properties"
import PropertyCard from "@/components/property-card"
import MapView from "@/components/map-view"
import type { Property } from "@/data/properties"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useUIStateStore } from "@/lib/services/uiStateService"
import { useModeStore } from "@/lib/services/modeService"
import { useRouter } from "next/navigation"

export default function BuyerPage() {
  const [viewMode, setViewMode] = useState<"card" | "map">("card")
  const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0)
  const [likedProperties, setLikedProperties] = useState<string[]>([])
  const [superLikedProperties, setSuperLikedProperties] = useState<string[]>([])
  const [ignoredProperties, setIgnoredProperties] = useState<string[]>([])
  const [swipeDirection, setSwipeDirection] = useState<"left" | "right" | "up" | null>(null)
  const [isSwipeAnimating, setIsSwipeAnimating] = useState(false)
  const [touchStartX, setTouchStartX] = useState(0)
  const [touchStartY, setTouchStartY] = useState(0)
  const [touchDeltaX, setTouchDeltaX] = useState(0)
  const [touchDeltaY, setTouchDeltaY] = useState(0)
  const [isTouching, setIsTouching] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const { setPropertyDetailOpen, setSelectedPropertyId } = useUIStateStore()
  const { mode } = useModeStore()
  const router = useRouter()

  // Redirect if in seller mode
  useEffect(() => {
    if (mode === "seller") {
      router.push("/seller")
    }
  }, [mode, router])

  const handleSwipe = (direction: "left" | "right" | "up") => {
    if (isSwipeAnimating) return

    const currentProperty = properties[currentPropertyIndex]
    setSwipeDirection(direction)
    setIsSwipeAnimating(true)

    // Wait for animation to complete before updating state
    setTimeout(() => {
      if (direction === "left") {
        setIgnoredProperties([...ignoredProperties, currentProperty.id])
      } else if (direction === "right") {
        setLikedProperties([...likedProperties, currentProperty.id])
      } else if (direction === "up") {
        setSuperLikedProperties([...superLikedProperties, currentProperty.id])
      }

      // Move to the next property
      if (currentPropertyIndex < properties.length - 1) {
        setCurrentPropertyIndex(currentPropertyIndex + 1)
      }

      setSwipeDirection(null)
      setIsSwipeAnimating(false)
      setTouchDeltaX(0)
      setTouchDeltaY(0)
    }, 300)
  }

  const handlePropertySelect = (property: Property) => {
    setSelectedPropertyId(property.id)
    setPropertyDetailOpen(true)
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === "card" ? "map" : "card")
  }

  // Improved touch handling for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return
    setTouchStartX(e.touches[0].clientX)
    setTouchStartY(e.touches[0].clientY)
    setIsTouching(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !isTouching) return
    const deltaX = e.touches[0].clientX - touchStartX
    const deltaY = e.touches[0].clientY - touchStartY
    setTouchDeltaX(deltaX)
    setTouchDeltaY(deltaY)
  }

  const handleTouchEnd = () => {
    if (!isMobile) return
    setIsTouching(false)

    const swipeThreshold = 100

    // Determine swipe direction based on which delta is larger
    if (Math.abs(touchDeltaX) > Math.abs(touchDeltaY)) {
      // Horizontal swipe
      if (touchDeltaX > swipeThreshold) {
        handleSwipe("right")
      } else if (touchDeltaX < -swipeThreshold) {
        handleSwipe("left")
      } else {
        // Reset if not enough movement
        setTouchDeltaX(0)
        setTouchDeltaY(0)
      }
    } else {
      // Vertical swipe
      if (touchDeltaY < -swipeThreshold) {
        handleSwipe("up")
      } else {
        // Reset if not enough movement
        setTouchDeltaX(0)
        setTouchDeltaY(0)
      }
    }
  }

  // Filter out properties that have been acted upon
  const availableProperties = properties.filter(
    (property) =>
      !likedProperties.includes(property.id) &&
      !superLikedProperties.includes(property.id) &&
      !ignoredProperties.includes(property.id),
  )

  const currentProperty = availableProperties[currentPropertyIndex]

  // Manual swipe buttons for mobile
  const SwipeButtons = () => (
    <div className="flex justify-center space-x-4 mt-6">
      <button
        onClick={() => handleSwipe("left")}
        className="bg-error text-white p-4 rounded-full shadow-lg hover:bg-error/90 transition-colors"
        aria-label="Ignore property"
        disabled={isSwipeAnimating}
      >
        <X size={24} />
      </button>
      <button
        onClick={() => handleSwipe("up")}
        className="bg-accent-500 text-white p-4 rounded-full shadow-lg hover:bg-accent-600 transition-colors"
        aria-label="Super like property"
        disabled={isSwipeAnimating}
      >
        <Star size={24} />
      </button>
      <button
        onClick={() => handleSwipe("right")}
        className="bg-primary-600 text-white p-4 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
        aria-label="Like property"
        disabled={isSwipeAnimating}
      >
        <Heart size={24} />
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile View */}
      {isMobile && (
        <div className="p-4">
          {/* View toggle button */}
          <button
            className="fixed bottom-20 right-4 z-30 bg-primary-600 text-white p-3 rounded-full shadow-lg"
            onClick={toggleViewMode}
            aria-label={viewMode === "card" ? "Switch to map view" : "Switch to card view"}
          >
            {viewMode === "card" ? <Map size={24} /> : <ArrowLeft size={24} />}
          </button>

          {viewMode === "card" && (
            <div className="relative h-[calc(100vh-220px)] flex flex-col">
              <h1
                ref={titleRef}
                className="text-2xl font-bold text-neutral-900 mb-4 sticky top-0 bg-neutral-50 z-10 pb-2"
              >
                Recommended Properties
              </h1>
              <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0 flex flex-col justify-center">
                  {currentProperty ? (
                    <div
                      ref={cardRef}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                      style={{
                        transform: isTouching
                          ? `translateX(${touchDeltaX}px) translateY(${touchDeltaY}px) rotate(${touchDeltaX * 0.05}deg)`
                          : "none",
                        transition: !isTouching ? "transform 0.3s ease" : "none",
                      }}
                    >
                      <PropertyCard
                        property={currentProperty}
                        onSwipe={handleSwipe}
                        isMobile={true}
                        className={swipeDirection ? `swipe-${swipeDirection}` : ""}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="bg-white p-6 rounded-xl shadow-md max-w-sm">
                        <h2 className="text-xl font-semibold text-neutral-700 mb-2">No more properties</h2>
                        <p className="text-neutral-500 mb-4">
                          We've run out of properties matching your preferences. Check back later or adjust your
                          preferences.
                        </p>
                        <button
                          onClick={() => window.location.reload()}
                          className="bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Reset & Start Over
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                {/* Gradient fade at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-neutral-50 to-transparent pointer-events-none"></div>
              </div>
              {currentProperty && <SwipeButtons />}
            </div>
          )}

          {viewMode === "map" && (
            <div className="h-[calc(100vh-160px)]">
              <MapView
                properties={properties}
                onPropertySelect={handlePropertySelect}
                selectedProperty={currentProperty}
              />
            </div>
          )}
        </div>
      )}

      {/* Desktop View */}
      {!isMobile && (
        <div className="container mx-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
            <div className="lg:col-span-4 h-[calc(100vh-160px)] sticky top-20">
              <MapView
                properties={properties}
                onPropertySelect={handlePropertySelect}
                selectedProperty={currentProperty}
              />
            </div>
            <div className="lg:col-span-2 max-w-sm">
              <h1
                ref={titleRef}
                className="text-2xl font-bold text-neutral-900 mb-6 sticky top-20 bg-neutral-50 z-10 pb-2"
              >
                Recommended Properties
              </h1>
              <div className="grid grid-cols-1 gap-6 max-h-[calc(100vh-240px)] overflow-y-auto pr-2 relative">
                {properties.map((property) => (
                  <PropertyCard key={property.id} property={property} onClick={() => handlePropertySelect(property)} />
                ))}
                {/* Gradient fade at bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-neutral-50 to-transparent pointer-events-none"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

