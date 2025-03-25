"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface RangeSliderProps {
  min: number
  max: number
  step: number
  minValue: number
  maxValue: number
  onChange: (minValue: number, maxValue: number) => void
  formatValue?: (value: number) => string
}

export default function RangeSlider({
  min,
  max,
  step,
  minValue,
  maxValue,
  onChange,
  formatValue = (value) => value.toString(),
}: RangeSliderProps) {
  const [isDraggingMin, setIsDraggingMin] = useState(false)
  const [isDraggingMax, setIsDraggingMax] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)

  // Calculate positions
  const getPercentage = (value: number) => {
    return ((value - min) / (max - min)) * 100
  }

  const minPos = getPercentage(minValue)
  const maxPos = getPercentage(maxValue)

  // Handle mouse/touch events
  const handleTrackMouseDown = (e: React.MouseEvent) => {
    if (!trackRef.current) return

    const trackRect = trackRef.current.getBoundingClientRect()
    const clickPos = ((e.clientX - trackRect.left) / trackRect.width) * 100

    // Determine which thumb to move based on click position
    const distToMin = Math.abs(clickPos - minPos)
    const distToMax = Math.abs(clickPos - maxPos)

    if (distToMin <= distToMax) {
      setIsDraggingMin(true)
      updateMinValue(e.clientX)
    } else {
      setIsDraggingMax(true)
      updateMaxValue(e.clientX)
    }
  }

  const updateMinValue = (clientX: number) => {
    if (!trackRef.current) return

    const trackRect = trackRef.current.getBoundingClientRect()
    const percentage = (clientX - trackRect.left) / trackRect.width
    let newValue = Math.round((percentage * (max - min) + min) / step) * step

    // Constrain to min and max values
    newValue = Math.max(min, Math.min(newValue, maxValue - step))

    onChange(newValue, maxValue)
  }

  const updateMaxValue = (clientX: number) => {
    if (!trackRef.current) return

    const trackRect = trackRef.current.getBoundingClientRect()
    const percentage = (clientX - trackRect.left) / trackRect.width
    let newValue = Math.round((percentage * (max - min) + min) / step) * step

    // Constrain to min and max values
    newValue = Math.max(minValue + step, Math.min(newValue, max))

    onChange(minValue, newValue)
  }

  // Handle mouse move and up events
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingMin) {
        updateMinValue(e.clientX)
      } else if (isDraggingMax) {
        updateMaxValue(e.clientX)
      }
    }

    const handleMouseUp = () => {
      setIsDraggingMin(false)
      setIsDraggingMax(false)
    }

    if (isDraggingMin || isDraggingMax) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDraggingMin, isDraggingMax, minValue, maxValue])

  // Handle touch events for mobile
  const handleTouchStart = (e: React.TouchEvent, isMin: boolean) => {
    e.stopPropagation()
    if (isMin) {
      setIsDraggingMin(true)
    } else {
      setIsDraggingMax(true)
    }
  }

  useEffect(() => {
    const handleTouchMove = (e: TouchEvent) => {
      if (isDraggingMin) {
        updateMinValue(e.touches[0].clientX)
      } else if (isDraggingMax) {
        updateMaxValue(e.touches[0].clientX)
      }
    }

    const handleTouchEnd = () => {
      setIsDraggingMin(false)
      setIsDraggingMax(false)
    }

    if (isDraggingMin || isDraggingMax) {
      document.addEventListener("touchmove", handleTouchMove)
      document.addEventListener("touchend", handleTouchEnd)
    }

    return () => {
      document.removeEventListener("touchmove", handleTouchMove)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [isDraggingMin, isDraggingMax, minValue, maxValue])

  return (
    <div className="mt-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-neutral-700">{formatValue(minValue)}</span>
        <span className="text-sm font-medium text-neutral-700">{formatValue(maxValue)}</span>
      </div>

      <div
        ref={trackRef}
        className="range-slider h-2 bg-neutral-200 rounded-full relative cursor-pointer"
        onMouseDown={handleTrackMouseDown}
      >
        {/* Active track */}
        <div
          className="range-slider-track absolute h-full bg-primary-500 rounded-full"
          style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
        ></div>

        {/* Min thumb */}
        <div
          className="range-slider-thumb absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white border-2 border-primary-500 cursor-pointer z-10"
          style={{ left: `${minPos}%` }}
          onMouseDown={(e) => {
            e.stopPropagation()
            setIsDraggingMin(true)
          }}
          onTouchStart={(e) => handleTouchStart(e, true)}
        ></div>

        {/* Max thumb */}
        <div
          className="range-slider-thumb absolute top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-white border-2 border-primary-500 cursor-pointer z-10"
          style={{ left: `${maxPos}%` }}
          onMouseDown={(e) => {
            e.stopPropagation()
            setIsDraggingMax(true)
          }}
          onTouchStart={(e) => handleTouchStart(e, false)}
        ></div>
      </div>

      <div className="flex justify-between mt-1">
        <span className="text-xs text-neutral-500">{formatValue(min)}</span>
        <span className="text-xs text-neutral-500">{formatValue(max)}</span>
      </div>
    </div>
  )
}

