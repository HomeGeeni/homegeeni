"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Heart, Share2, Info, X, Star } from "lucide-react"
import type { Property } from "@/data/properties"
import { formatCurrency } from "@/utils/format"
import Tooltip from "./tooltip"
import { useUIStateStore } from "@/lib/services/uiStateService"
import { useRouter } from "next/navigation"

interface PropertyCardProps {
  property: Property
  onSwipe?: (direction: "left" | "right" | "up") => void
  isMobile?: boolean
  onClick?: () => void
  className?: string
}

export default function PropertyCard({
  property,
  onSwipe,
  isMobile = false,
  onClick,
  className = "",
}: PropertyCardProps) {
  const router = useRouter()
  const [startX, setStartX] = useState(0)
  const [startY, setStartY] = useState(0)
  const [offsetX, setOffsetX] = useState(0)
  const [offsetY, setOffsetY] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [swipeAnimation, setSwipeAnimation] = useState<"left" | "right" | "up" | null>(null)
  const [isLiked, setIsLiked] = useState(property.liked || false)
  const cardRef = useRef<HTMLDivElement>(null)
  const swipeThreshold = 100
  const { setPropertyDetailOpen, setSelectedPropertyId } = useUIStateStore()

  // Reset animation when property changes
  useEffect(() => {
    setSwipeAnimation(null)
    setOffsetX(0)
    setOffsetY(0)
  }, [property.id])

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile || !onSwipe) return
    setStartX(e.touches[0].clientX)
    setStartY(e.touches[0].clientY)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isMobile || !onSwipe) return
    setOffsetX(e.touches[0].clientX - startX)
    setOffsetY(e.touches[0].clientY - startY)
  }

  const handleTouchEnd = () => {
    if (!isMobile || !onSwipe) return

    if (Math.abs(offsetX) > Math.abs(offsetY)) {
      // Horizontal swipe
      if (offsetX > swipeThreshold) {
        setSwipeAnimation("right")
        setTimeout(() => onSwipe("right"), 300)
      } else if (offsetX < -swipeThreshold) {
        setSwipeAnimation("left")
        setTimeout(() => onSwipe("left"), 300)
      } else {
        // Reset if not enough movement
        setOffsetX(0)
        setOffsetY(0)
      }
    } else {
      // Vertical swipe
      if (offsetY < -swipeThreshold) {
        setSwipeAnimation("up")
        setTimeout(() => onSwipe("up"), 300)
      } else {
        // Reset if not enough movement
        setOffsetX(0)
        setOffsetY(0)
      }
    }
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((current) => (current === property.images.length - 1 ? 0 : current + 1))
  }

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentImageIndex((current) => (current === 0 ? property.images.length - 1 : current - 1))
  }

  const toggleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleCardClick = () => {
    if (onClick) {
      onClick()
    } else if (isMobile) {
      // Navigate to property details page on mobile
      router.push(`/property/${property.id}`)
    } else {
      // Open property detail modal on desktop
      setSelectedPropertyId(property.id)
      setPropertyDetailOpen(true)
    }
  }

  // Visual feedback for swipe direction
  let swipeIndicator = null
  if (offsetX > 50) {
    swipeIndicator = (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-success/80 text-white rounded-full p-4 transform rotate-12">
          <Heart size={40} />
        </div>
      </div>
    )
  } else if (offsetX < -50) {
    swipeIndicator = (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-error/80 text-white rounded-full p-4 transform -rotate-12">
          <X size={40} />
        </div>
      </div>
    )
  } else if (offsetY < -50) {
    swipeIndicator = (
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-accent/80 text-white rounded-full p-4">
          <Star size={40} />
        </div>
      </div>
    )
  }

  const cardStyle = {
    transform: isMobile ? `translateX(${offsetX}px) translateY(${offsetY}px) rotate(${offsetX * 0.05}deg)` : "none",
    transition: offsetX === 0 && offsetY === 0 ? "transform 0.3s ease" : "none",
  }

  const valuationDiff = property.estimatedValue - property.price
  const valuationPercentage = ((valuationDiff / property.price) * 100).toFixed(1)
  const isUndervalued = valuationDiff > 0

  return (
    <div
      ref={cardRef}
      className={`bg-white rounded-xl shadow-lg overflow-hidden ${
        isMobile ? "w-full max-w-sm mx-auto" : "w-full"
      } transition-all duration-300 ${swipeAnimation ? `swipe-${swipeAnimation}` : ""} ${className} cursor-pointer`}
      style={cardStyle}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleCardClick}
    >
      <div className="relative">
        <div className="relative h-64 w-full">
          <Image
            src={property.images[currentImageIndex] || "/placeholder.svg?height=600&width=800"}
            alt={property.address}
            fill
            className="object-cover"
          />

          {/* Image navigation */}
          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors"
                aria-label="Previous image"
              >
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
                  <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition-colors"
                aria-label="Next image"
              >
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
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>

              {/* Image indicators */}
              <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
                {property.images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                      index === currentImageIndex ? "bg-white w-4" : "bg-white/60"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-md flex items-center whitespace-nowrap">
              {property.percentMatch}% Match
            </span>
            {property.originalPrice && property.originalPrice > property.price && (
              <span className="bg-success text-white px-3 py-1 rounded-full text-sm font-medium shadow-md flex items-center whitespace-nowrap">
                {Math.round(((property.originalPrice - property.price) / property.originalPrice) * 100)}% Price Cut
              </span>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              className="bg-white/90 p-2 rounded-full hover:bg-white shadow-md transition-colors"
              aria-label="Share property"
              onClick={(e) => e.stopPropagation()}
            >
              <Share2 size={18} className="text-neutral-700" />
            </button>
            <button
              className={`p-2 rounded-full shadow-md transition-colors ${
                isLiked ? "bg-primary-500 text-white" : "bg-white/90 text-neutral-700 hover:bg-white"
              }`}
              aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
              onClick={toggleLike}
            >
              <Heart size={18} />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent p-4">
          <h3 className="text-white text-lg font-semibold">{property.address}</h3>
          <p className="text-white/90 text-sm">
            {property.city}, {property.state} {property.zipCode}
          </p>
        </div>

        {/* Swipe indicator overlay */}
        {swipeIndicator}
      </div>

      <div className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-neutral-900">{formatCurrency(property.price)}</span>
              {property.originalPrice && property.originalPrice > property.price && (
                <span className="text-sm text-neutral-500 line-through ml-2">
                  {formatCurrency(property.originalPrice)}
                </span>
              )}
              <div className="relative ml-2">
                <button
                  className="text-neutral-500 hover:text-primary-600"
                  onClick={(e) => {
                    e.stopPropagation()
                    setShowTooltip(!showTooltip)
                  }}
                  aria-label="Show valuation info"
                >
                  <Info size={16} />
                </button>
                {showTooltip && (
                  <Tooltip
                    content={
                      <div>
                        <p className="font-medium mb-1">HomeGeeni Valuation</p>
                        <p className="mb-1">{formatCurrency(property.estimatedValue)}</p>
                        <p className={`text-sm ${isUndervalued ? "text-success" : "text-error"}`}>
                          {isUndervalued ? "+" : ""}
                          {formatCurrency(valuationDiff)} ({valuationPercentage}%)
                        </p>
                      </div>
                    }
                    onClose={() => setShowTooltip(false)}
                  />
                )}
              </div>
            </div>
            <p className={`text-sm ${isUndervalued ? "text-success font-medium" : "text-error font-medium"}`}>
              {isUndervalued ? "Undervalued" : "Overvalued"} by {Math.abs(Number.parseFloat(valuationPercentage))}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-neutral-700 font-medium">
              {property.beds} beds, {property.baths} baths
            </p>
            <p className="text-neutral-500 text-sm">{property.squareFeet.toLocaleString()} sqft</p>
          </div>
        </div>

        <div className="flex justify-between text-sm mb-4">
          <span className="text-neutral-600">
            <span className="font-medium">{property.daysOnMarket}</span> days on market
          </span>
          <span className="text-neutral-600">
            Built <span className="font-medium">{property.yearBuilt}</span>
          </span>
        </div>

        <p className="text-neutral-700 text-sm line-clamp-2 mb-3">{property.aiSummary}</p>

        <button
          className="text-primary-600 text-sm font-medium hover:underline flex items-center"
          onClick={(e) => {
            e.stopPropagation()
            if (isMobile) {
              router.push(`/property/${property.id}`)
            } else {
              setSelectedPropertyId(property.id)
              setPropertyDetailOpen(true)
            }
          }}
        >
          View details
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-1"
          >
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </button>
      </div>
    </div>
  )
}

