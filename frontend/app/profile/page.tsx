"use client"

import type React from "react"

import { useState } from "react"
import { User, Mail, Phone, Lock, CreditCard, Bell, LogOut, Check, Home, Building, Info } from "lucide-react"
import { useModeStore } from "@/lib/services/modeService"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"account" | "notifications" | "payment" | "preferences">("account")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    password: "••••••••",
  })
  const [isSuccess, setIsSuccess] = useState(false)
  const { mode, setMode } = useModeStore()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Simulate API call
    setTimeout(() => {
      setIsEditing(false)
      setIsSuccess(true)

      // Hide success message after 3 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 3000)
    }, 1000)
  }

  return (
    <div className="container mx-auto p-4 md:p-6 max-w-4xl">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Your Profile</h1>

      {isSuccess && (
        <div className="bg-success/10 text-success p-4 rounded-lg mb-6 flex items-center">
          <Check size={24} className="mr-3" />
          Profile updated successfully!
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* Sidebar */}
          <div className="md:w-64 bg-neutral-50 p-6 border-r border-neutral-200">
            <div className="flex flex-col items-center mb-6">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mb-3">
                <User size={32} className="text-primary-600" />
              </div>
              <h2 className="text-lg font-semibold">{formData.name}</h2>
              <p className="text-neutral-500 text-sm">{formData.email}</p>

              <div className="mt-3 flex items-center">
                <span className="text-sm text-neutral-600 mr-2">Mode:</span>
                <div className="bg-white rounded-full shadow-sm border border-neutral-200 flex">
                  <button
                    onClick={() => setMode("buyer")}
                    className={`flex items-center px-3 py-1 rounded-l-full text-xs ${
                      mode === "buyer" ? "bg-primary-600 text-white" : "text-neutral-600"
                    }`}
                  >
                    <Home size={12} className="mr-1" />
                    Buyer
                  </button>
                  <button
                    onClick={() => setMode("seller")}
                    className={`flex items-center px-3 py-1 rounded-r-full text-xs ${
                      mode === "seller" ? "bg-accent-500 text-white" : "text-neutral-600"
                    }`}
                  >
                    <Building size={12} className="mr-1" />
                    Seller
                  </button>
                </div>
              </div>
            </div>

            <nav>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center ${
                  activeTab === "account" ? "bg-primary-50 text-primary-700" : "text-neutral-700 hover:bg-neutral-100"
                }`}
                onClick={() => setActiveTab("account")}
              >
                <User size={18} className="mr-3" />
                Account Settings
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center ${
                  activeTab === "notifications"
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
                onClick={() => setActiveTab("notifications")}
              >
                <Bell size={18} className="mr-3" />
                Notifications
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center ${
                  activeTab === "payment" ? "bg-primary-50 text-primary-700" : "text-neutral-700 hover:bg-neutral-100"
                }`}
                onClick={() => setActiveTab("payment")}
              >
                <CreditCard size={18} className="mr-3" />
                Payment Methods
              </button>
              <button
                className={`w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center ${
                  activeTab === "preferences"
                    ? "bg-primary-50 text-primary-700"
                    : "text-neutral-700 hover:bg-neutral-100"
                }`}
                onClick={() => setActiveTab("preferences")}
              >
                <Home size={18} className="mr-3" />
                User Mode
              </button>
              <button className="w-full text-left px-3 py-2 rounded-lg mb-1 flex items-center text-neutral-700 hover:bg-neutral-100">
                <LogOut size={18} className="mr-3" />
                Sign Out
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {/* Account Settings */}
            {activeTab === "account" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">Account Settings</h2>
                  {!isEditing && (
                    <button
                      className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg font-medium hover:bg-primary-100"
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  )}
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-neutral-700 font-medium mb-2">Full Name</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <User size={18} className="text-neutral-500" />
                        </div>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-medium mb-2">Email Address</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Mail size={18} className="text-neutral-500" />
                        </div>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-medium mb-2">Phone Number</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Phone size={18} className="text-neutral-500" />
                        </div>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-700"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-neutral-700 font-medium mb-2">Password</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Lock size={18} className="text-neutral-500" />
                        </div>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          disabled={!isEditing}
                          className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 disabled:bg-neutral-50 disabled:text-neutral-700"
                        />
                      </div>
                    </div>

                    {isEditing && (
                      <div className="flex justify-end space-x-3 pt-4">
                        <button
                          type="button"
                          className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-50"
                          onClick={() => setIsEditing(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                </form>
              </div>
            )}

            {/* Notifications */}
            {activeTab === "notifications" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Notification Settings</h2>

                <div className="space-y-6">
                  <div className="border-b border-neutral-200 pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-medium">New Property Alerts</h3>
                        <p className="text-neutral-500 text-sm">
                          Get notified when new properties match your preferences
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="border-b border-neutral-200 pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-medium">Price Change Alerts</h3>
                        <p className="text-neutral-500 text-sm">
                          Get notified when prices change on properties you've liked
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="border-b border-neutral-200 pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-medium">Offer Updates</h3>
                        <p className="text-neutral-500 text-sm">Get notified about updates to your offers</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>

                  <div className="border-b border-neutral-200 pb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-neutral-500 text-sm">Receive notifications via email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-medium">Push Notifications</h3>
                        <p className="text-neutral-500 text-sm">Receive notifications on your device</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-neutral-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Methods */}
            {activeTab === "payment" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">Payment Methods</h2>

                <div className="border border-neutral-200 rounded-lg p-4 mb-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-12 h-8 bg-neutral-800 rounded mr-4 flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium">Visa ending in 4242</p>
                        <p className="text-neutral-500 text-sm">Expires 12/2025</p>
                      </div>
                    </div>
                    <div>
                      <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded text-xs font-medium">
                        Default
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full border border-dashed border-neutral-300 rounded-lg p-4 text-neutral-600 hover:bg-neutral-50 flex items-center justify-center">
                  <CreditCard size={18} className="mr-2" />
                  Add Payment Method
                </button>
              </div>
            )}

            {/* User Mode Preferences */}
            {activeTab === "preferences" && (
              <div>
                <h2 className="text-xl font-semibold mb-6">User Mode Preferences</h2>

                <div className="space-y-6">
                  <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
                    <div className="p-6">
                      <h3 className="text-lg font-medium mb-4">Select Your Default Mode</h3>
                      <p className="text-neutral-600 mb-6">
                        Choose which mode you'd like to use by default when you log in to HomeGeeni.
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            mode === "buyer"
                              ? "border-primary-500 bg-primary-50"
                              : "border-neutral-200 hover:border-primary-300"
                          }`}
                          onClick={() => setMode("buyer")}
                        >
                          <div className="flex items-center mb-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                mode === "buyer" ? "bg-primary-100" : "bg-neutral-100"
                              }`}
                            >
                              <Home size={20} className={mode === "buyer" ? "text-primary-600" : "text-neutral-500"} />
                            </div>
                            <div>
                              <h4 className="font-medium">Buyer Mode</h4>
                              <p className="text-sm text-neutral-500">Browse and purchase properties</p>
                            </div>
                          </div>
                          <ul className="text-sm space-y-2 text-neutral-600 ml-2">
                            <li className="flex items-start">
                              <Check size={16} className="text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                              Browse available properties
                            </li>
                            <li className="flex items-start">
                              <Check size={16} className="text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                              Save favorite listings
                            </li>
                            <li className="flex items-start">
                              <Check size={16} className="text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                              Schedule property visits
                            </li>
                            <li className="flex items-start">
                              <Check size={16} className="text-primary-500 mr-2 mt-0.5 flex-shrink-0" />
                              Make offers on properties
                            </li>
                          </ul>
                        </div>

                        <div
                          className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                            mode === "seller"
                              ? "border-accent-500 bg-accent-50"
                              : "border-neutral-200 hover:border-accent-300"
                          }`}
                          onClick={() => setMode("seller")}
                        >
                          <div className="flex items-center mb-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                                mode === "seller" ? "bg-accent-100" : "bg-neutral-100"
                              }`}
                            >
                              <Building
                                size={20}
                                className={mode === "seller" ? "text-accent-600" : "text-neutral-500"}
                              />
                            </div>
                            <div>
                              <h4 className="font-medium">Seller Mode</h4>
                              <p className="text-sm text-neutral-500">List and manage your properties</p>
                            </div>
                          </div>
                          <ul className="text-sm space-y-2 text-neutral-600 ml-2">
                            <li className="flex items-start">
                              <Check size={16} className="text-accent-500 mr-2 mt-0.5 flex-shrink-0" />
                              List properties for sale
                            </li>
                            <li className="flex items-start">
                              <Check size={16} className="text-accent-500 mr-2 mt-0.5 flex-shrink-0" />
                              Manage property listings
                            </li>
                            <li className="flex items-start">
                              <Check size={16} className="text-accent-500 mr-2 mt-0.5 flex-shrink-0" />
                              Review and respond to offers
                            </li>
                            <li className="flex items-start">
                              <Check size={16} className="text-accent-500 mr-2 mt-0.5 flex-shrink-0" />
                              Schedule and track showings
                            </li>
                          </ul>
                        </div>
                      </div>

                      <div className="mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200">
                        <h4 className="font-medium mb-2 flex items-center">
                          <Info size={16} className="text-primary-500 mr-2" />
                          Quick Tip
                        </h4>
                        <p className="text-sm text-neutral-600">
                          You can quickly switch between modes using the toggle in your profile menu or the floating
                          button at the bottom right of the screen.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

