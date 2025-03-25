"use client"

import { AlertTriangle, AlertCircle, X, Info } from "lucide-react"
import { useUIStateStore } from "@/lib/services/uiStateService"

export default function ConfirmationDialog() {
  const { confirmationDialog, closeConfirmationDialog } = useUIStateStore()
  const { isOpen, title, message, confirmText, cancelText, onConfirm, onCancel, type } = confirmationDialog

  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm()
    closeConfirmationDialog()
  }

  const handleCancel = () => {
    onCancel()
    closeConfirmationDialog()
  }

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <AlertTriangle className="h-6 w-6 text-error" />
      case "info":
        return <Info className="h-6 w-6 text-primary-600" />
      case "warning":
      default:
        return <AlertCircle className="h-6 w-6 text-warning" />
    }
  }

  const getConfirmButtonStyle = () => {
    switch (type) {
      case "danger":
        return "bg-error hover:bg-error/90 text-white"
      case "info":
        return "bg-primary-600 hover:bg-primary-700 text-white"
      case "warning":
      default:
        return "bg-warning hover:bg-warning/90 text-white"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-neutral-200">
          <div className="flex items-center space-x-3">
            {getIcon()}
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <button
            onClick={handleCancel}
            className="text-neutral-500 hover:text-neutral-700 rounded-full p-1 hover:bg-neutral-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <p className="text-neutral-600">{message}</p>
        </div>

        <div className="flex justify-end space-x-3 p-4 border-t border-neutral-200 bg-neutral-50">
          <button
            onClick={handleCancel}
            className="px-4 py-2 border border-neutral-300 rounded-md text-neutral-700 hover:bg-neutral-100"
          >
            {cancelText}
          </button>
          <button onClick={handleConfirm} className={`px-4 py-2 rounded-md ${getConfirmButtonStyle()}`}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

