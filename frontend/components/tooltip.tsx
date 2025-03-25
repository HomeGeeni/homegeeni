"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"

interface TooltipProps {
  content: React.ReactNode
  onClose: () => void
  position?: "top" | "right" | "bottom" | "left"
}

export default function Tooltip({ content, onClose, position = "top" }: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    // Auto-close after 5 seconds
    const timeout = setTimeout(() => {
      onClose()
    }, 5000)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      clearTimeout(timeout)
    }
  }, [onClose])

  const positionClasses = {
    top: "bottom-full left-1/2 transform -translate-x-1/2 -translate-y-2 mb-2",
    right: "left-full top-1/2 transform -translate-y-1/2 translate-x-2 ml-2",
    bottom: "top-full left-1/2 transform -translate-x-1/2 translate-y-2 mt-2",
    left: "right-full top-1/2 transform -translate-y-1/2 -translate-x-2 mr-2",
  }

  const arrowClasses = {
    top: "top-full left-1/2 transform -translate-x-1/2 border-t-primary-600 border-l-transparent border-r-transparent",
    right:
      "right-full top-1/2 transform -translate-y-1/2 border-r-primary-600 border-t-transparent border-b-transparent",
    bottom:
      "bottom-full left-1/2 transform -translate-x-1/2 border-b-primary-600 border-l-transparent border-r-transparent",
    left: "left-full top-1/2 transform -translate-y-1/2 border-l-primary-600 border-t-transparent border-b-transparent",
  }

  return (
    <div ref={tooltipRef} className={`absolute z-50 ${positionClasses[position]} tooltip-enter tooltip-enter-active`}>
      <div className="bg-primary-600 text-white rounded-lg p-3 shadow-lg max-w-xs">
        <button
          className="absolute top-2 right-2 text-white/80 hover:text-white"
          onClick={onClose}
          aria-label="Close tooltip"
        >
          <X size={14} />
        </button>
        <div className="pr-4">{content}</div>
      </div>
      <div className={`absolute w-0 h-0 border-8 ${arrowClasses[position]}`}></div>
    </div>
  )
}

