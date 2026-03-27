/*
 * Questo file definisce lo store globale Zustand delle impostazioni per evitare prop drilling.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DEFAULT_SETTINGS } from "@/types/settings.types";
import type { SettingsStoreState } from "@/types/store.types";

/**
 * Crea lo store Zustand con persistenza locale delle impostazioni lato client.
 */
export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set) => ({
      settings: DEFAULT_SETTINGS,
      setSettings: (settings) => set({ settings }),
    }),
    {
      name: "excel-scrapper-settings-store",
    },
  ),
);
