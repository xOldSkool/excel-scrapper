/*
 * Questo file centralizza i tipi legati agli store Zustand del progetto.
 */

import type { AppSettings } from "@/types/settings.types";

export type SettingsStoreState = {
  settings: AppSettings;
  setSettings: (settings: AppSettings) => void;
};
