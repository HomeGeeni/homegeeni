"use client"

import type { Property } from "@/data/properties"
import PropertyMap from "./property-map"

interface MapViewProps {
  properties: Property[]
  onPropertySelect: (property: Property) => void
  selectedProperty?: Property
}

export default function MapView({ properties, onPropertySelect, selectedProperty }: MapViewProps) {
  return (
    <PropertyMap
      properties={properties}
      onPropertySelect={onPropertySelect}
      selectedProperty={selectedProperty}
      className="bg-neutral-100"
    />
  )
}

