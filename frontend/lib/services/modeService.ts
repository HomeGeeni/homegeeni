"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type Mode = "buyer" | "seller"

interface ModeState {
  mode: Mode
  setMode: (mode: Mode) => void
  canSwitchMode: (path: string, isMobile: boolean) => boolean
}

export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      mode: "buyer",
      setMode: (mode) => set({ mode }),
      canSwitchMode: (path: string, isMobile: boolean) => {
        // Allow mode switching on buyer and seller pages in mobile view
        return isMobile && (path === "/buyer" || path === "/seller")
      },
    }),
    {
      name: "mode-storage",
    },
  ),
)

