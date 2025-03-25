"use client"

import { create } from "zustand"

interface UIState {
  activeFloatingMenu: "none" | "chat" | "mode"
  setActiveFloatingMenu: (menu: "none" | "chat" | "mode") => void
  propertyDetailOpen: boolean
  setPropertyDetailOpen: (open: boolean) => void
  selectedPropertyId: string | null
  setSelectedPropertyId: (id: string | null) => void
  confirmationDialog: {
    isOpen: boolean
    title: string
    message: string
    confirmText: string
    cancelText: string
    onConfirm: () => void
    onCancel: () => void
    type: "warning" | "info" | "danger"
  }
  openConfirmationDialog: (params: {
    title: string
    message: string
    confirmText?: string
    cancelText?: string
    onConfirm: () => void
    onCancel?: () => void
    type?: "warning" | "info" | "danger"
  }) => void
  closeConfirmationDialog: () => void
}

export const useUIStateStore = create<UIState>((set) => ({
  activeFloatingMenu: "none",
  setActiveFloatingMenu: (menu) => set({ activeFloatingMenu: menu }),
  propertyDetailOpen: false,
  setPropertyDetailOpen: (open) => set({ propertyDetailOpen: open }),
  selectedPropertyId: null,
  setSelectedPropertyId: (id) => set({ selectedPropertyId: id }),
  confirmationDialog: {
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    onConfirm: () => {},
    onCancel: () => {},
    type: "warning",
  },
  openConfirmationDialog: (params) =>
    set({
      confirmationDialog: {
        isOpen: true,
        title: params.title,
        message: params.message,
        confirmText: params.confirmText || "Confirm",
        cancelText: params.cancelText || "Cancel",
        onConfirm: params.onConfirm,
        onCancel: params.onCancel || (() => set({ confirmationDialog: { ...params, isOpen: false } })),
        type: params.type || "warning",
      },
    }),
  closeConfirmationDialog: () =>
    set((state) => ({
      confirmationDialog: {
        ...state.confirmationDialog,
        isOpen: false,
      },
    })),
}))

