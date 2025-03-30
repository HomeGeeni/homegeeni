"use client"

import { useParams, useRouter } from "next/navigation"
import { properties } from "@/data/properties"
import PropertyDetail from "@/components/property-detail"
import { ArrowLeft } from "lucide-react"

export default function PropertyPage() {
  const params = useParams()
  const router = useRouter()
  const propertyId = params.id as string

  const property = properties.find((p) => p.id === propertyId)

  if (!property) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Property Not Found</h1>
        <p className="text-neutral-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-neutral-600 hover:text-neutral-900 mb-6"
      >
        <ArrowLeft size={20} />
        <span>Back</span>
      </button>
      <PropertyDetail property={property} />
    </div>
  )
}

