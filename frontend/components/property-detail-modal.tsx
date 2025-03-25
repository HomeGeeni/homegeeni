"use client"

import { X } from "lucide-react"
import { useUIStateStore } from "@/lib/services/uiStateService"
import { properties } from "@/data/properties"
import PropertyDetail from "./property-detail"

export default function PropertyDetailModal() {
  const { propertyDetailOpen, setPropertyDetailOpen, selectedPropertyId } = useUIStateStore()

  if (!propertyDetailOpen || !selectedPropertyId) return null

  const property = properties.find((p) => p.id === selectedPropertyId)

  if (!property) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-40 overflow-y-auto">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          className="absolute top-4 right-4 z-10 bg-white/90 p-2 rounded-full shadow-md"
          onClick={() => setPropertyDetailOpen(false)}
        >
          <X size={20} className="text-neutral-700" />
        </button>
        <div className="p-6">
          <PropertyDetail property={property} isModal={true} />
        </div>
      </div>
    </div>
  )
}

