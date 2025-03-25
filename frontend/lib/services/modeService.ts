"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

type Mode = "buyer" | "seller"

interface ModeState {
  mode: Mode
  setMode: (mode: Mode) => void
}

export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      mode: "buyer",
      setMode: (mode) => set({ mode }),
    }),
    {
      name: "mode-storage",
    },
  ),
)

