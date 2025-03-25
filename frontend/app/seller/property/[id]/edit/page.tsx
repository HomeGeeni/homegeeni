"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, Upload, Plus, Trash2, Check } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { properties } from "@/data/properties"
import { useModeStore } from "@/lib/services/modeService"

export default function EditPropertyPage() {
  const params = useParams()
  const router = useRouter()
  const { mode } = useModeStore()
  const propertyId = params.id as string

  const [property, setProperty] = useState(properties.find((p) => p.id === propertyId) || null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [images, setImages] = useState<string[]>([])

  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zipCode: "",
    price: "",
    beds: "",
    baths: "",
    squareFeet: "",
    yearBuilt: "",
    propertyType: "Single Family",
    description: "",
    features: [""] as string[],
  })

  // Redirect if in buyer mode
  useEffect(() => {
    if (mode === "buyer") {
      router.push("/buyer")
    }
  }, [mode, router])

  // Load property data when component mounts
  useEffect(() => {
    const foundProperty = properties.find((p) => p.id === propertyId)
    setProperty(foundProperty || null)

    if (foundProperty) {
      setImages(foundProperty.images)
      setFormData({
        address: foundProperty.address,
        city: foundProperty.city,
        state: foundProperty.state,
        zipCode: foundProperty.zipCode,
        price: foundProperty.price.toString(),
        beds: foundProperty.beds.toString(),
        baths: foundProperty.baths.toString(),
        squareFeet: foundProperty.squareFeet.toString(),
        yearBuilt: foundProperty.yearBuilt.toString(),
        propertyType: foundProperty.propertyType,
        description: foundProperty.description,
        features: foundProperty.features.length > 0 ? foundProperty.features : [""],
      })
    }
  }, [propertyId])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures[index] = value
    setFormData({
      ...formData,
      features: updatedFeatures,
    })
  }

  const addFeature = () => {
    setFormData({
      ...formData,
      features: [...formData.features, ""],
    })
  }

  const removeFeature = (index: number) => {
    const updatedFeatures = [...formData.features]
    updatedFeatures.splice(index, 1)
    setFormData({
      ...formData,
      features: updatedFeatures,
    })
  }

  const addImage = () => {
    setImages([...images, "/placeholder.svg?height=400&width=600"])
  }

  const removeImage = (index: number) => {
    const updatedImages = [...images]
    updatedImages.splice(index, 1)
    setImages(updatedImages)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSuccess(true)

      // Redirect to property detail page after 2 seconds
      setTimeout(() => {
        router.push(`/seller/property/${propertyId}`)
      }, 2000)
    }, 1500)
  }

  if (!property) {
    return (
      <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-2xl font-bold text-neutral-900 mb-4">Property Not Found</h1>
        <p className="text-neutral-600 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Link href="/seller" className="text-primary-600 font-medium hover:underline">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <Link
        href={`/seller/property/${propertyId}`}
        className="inline-flex items-center text-neutral-600 hover:text-neutral-900 mb-6"
      >
        <ArrowLeft size={18} className="mr-2" />
        Back to Property
      </Link>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-neutral-900 mb-6">Edit Property</h1>

          {isSuccess ? (
            <div className="bg-success/10 text-success p-4 rounded-lg flex items-start">
              <Check size={24} className="mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold text-lg">Property Updated Successfully!</h3>
                <p>Your property has been updated. You'll be redirected to the property page.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {/* Property Images */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Property Images</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <div className="aspect-video bg-neutral-100 rounded-lg overflow-hidden">
                        <Image
                          src={image || "/placeholder.svg"}
                          alt={`Property image ${index + 1}`}
                          width={400}
                          height={300}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-neutral-700 hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={addImage}
                    className="aspect-video flex flex-col items-center justify-center border-2 border-dashed border-neutral-300 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors"
                  >
                    <Upload size={24} className="text-neutral-400 mb-2" />
                    <span className="text-sm text-neutral-500">Add Image</span>
                  </button>
                </div>
              </div>

              {/* Basic Information */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-neutral-700 font-medium mb-2">Street Address*</label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-medium mb-2">City*</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-medium mb-2">State*</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-medium mb-2">ZIP Code*</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Property Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-neutral-700 font-medium mb-2">Price*</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">$</span>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="w-full pl-8 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-medium mb-2">Bedrooms*</label>
                    <input
                      type="number"
                      name="beds"
                      value={formData.beds}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-medium mb-2">Bathrooms*</label>
                    <input
                      type="number"
                      name="baths"
                      value={formData.baths}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                      step="0.5"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-medium mb-2">Square Feet*</label>
                    <input
                      type="number"
                      name="squareFeet"
                      value={formData.squareFeet}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-medium mb-2">Year Built*</label>
                    <input
                      type="number"
                      name="yearBuilt"
                      value={formData.yearBuilt}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-700 font-medium mb-2">Property Type*</label>
                    <select
                      name="propertyType"
                      value={formData.propertyType}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      required
                    >
                      <option value="Single Family">Single Family</option>
                      <option value="Condo">Condo</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Multi-Family">Multi-Family</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Description</h2>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe your property in detail..."
                  required
                ></textarea>
              </div>

              {/* Features */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Features</h2>
                  <button
                    type="button"
                    onClick={addFeature}
                    className="text-primary-600 hover:text-primary-700 flex items-center"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Feature
                  </button>
                </div>

                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center mb-3">
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      className="flex-grow px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                      placeholder="e.g. Hardwood floors, Granite countertops, etc."
                    />
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="ml-2 p-2 text-neutral-500 hover:text-error"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent-500 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center hover:bg-accent-600 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                    Updating Property...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

