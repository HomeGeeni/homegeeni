"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Check } from "lucide-react"
import Link from "next/link"
import { useModeStore } from "@/lib/services/modeService"

export default function NewPropertyPage() {
  const router = useRouter()
  const { mode } = useModeStore()
  
  // Redirect if in buyer mode
  useEffect(() => {
    if (mode === 'buyer') {
      router.push('/buyer')
    }
  }, [mode, router])

  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [zipCode, setZipCode] = useState("")
  const [price, setPrice] = useState("")
  const [beds, setBeds] = useState("")
  const [baths, setBaths] = useState("")
  const [squareFeet, setSquareFeet] = useState("")
  const [yearBuilt, setYearBuilt] = useState("")
  const [propertyType, setPropertyType] = useState<"Single Family" | "Condo" | "Townhouse" | "Multi-Family">("Single Family")
  const [description, setDescription] = useState("")
  const [features, setFeatures] = useState<string[]>([])
  const [newFeature, setNewFeature] = useState("")
  const [images, setImages] = useState<{ file: File; preview: string }[]>([])
  const [documents, setDocuments] = useState<{ file: File; name: string }[]>([])
  const [tooltips, setTooltips] = useState<Record<string, boolean>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const toggleTooltip = (id: string) => {
    setTooltips((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleAddFeature = () => {
    if (newFeature && !features.includes(newFeature)) {
      setFeatures([...features, newFeature])
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (feature: string) => {
    setFeatures(features.filter((f) => f !== feature))
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }))
      setImages([...images, ...newImages])
    }
  }

  const handleRemoveImage = (index: number) => {
    const newImages = [...images]
    URL.revokeObjectURL(newImages[index].preview)
    newImages.splice(index, 1)
    setImages(newImages)
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newDocuments = Array.from(e.target.files).map((file) => ({
        file,
        name: file.name,
      }))
      setDocuments([...documents, ...newDocuments])
    }
  }

  const handleRemoveDocument = (index: number) => {
    const newDocuments = [...documents]
    newDocuments.splice(index, 1)
    setDocuments(newDocuments)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Redirect to seller dashboard after 2 seconds
      setTimeout(() => {
        router.push("/seller")
      }, 2000)
    }, 1500)
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <Link href="/seller" className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6">
        <ArrowLeft size={18} className="mr-2" />
        Back to Dashboard
      </Link>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">List a New Property</h1>

          {isSuccess ? (
            <div className="bg-success/10 text-success p-4 rounded-lg flex items-start">
              <Check size={24} className="mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg">Property Listed Successfully!</h3>
                <p>
                  Your property has been listed successfully. You'll be redirected to your dashboard in a moment.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="mb-8">
                <h2 className="text-lg font-semibold text-neutral-900 mb-4">Property Location</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-neutral-700 font-medium mb-2">Street Address</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="123 Main St"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-medium mb-2">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="Austin"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-medium mb-2">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                      placeholder="TX"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-700 font-medium mb-2">ZIP Code</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full px-4 py-\

