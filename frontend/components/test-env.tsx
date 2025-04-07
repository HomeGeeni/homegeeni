"use client"

export default function TestEnv() {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-2">Environment Variables Test</h2>
      <div className="bg-neutral-100 p-4 rounded-lg">
        <p className="font-mono text-sm">
          NEXT_PUBLIC_MAPBOX_TOKEN: {process.env.NEXT_PUBLIC_MAPBOX_TOKEN ? "Set" : "Not Set"}
        </p>
      </div>
    </div>
  )
} 