/*
 * Questo file contiene l'hook client per leggere/salvare impostazioni via Axios e sincronizzarle su Zustand.
 */

"use client";

import { useCallback, useMemo, useState } from "react";

import type { AxiosError } from "axios";

import { createApiClient } from "@/lib/api-client";
import { useSettingsStore } from "@/stores/settings-store";
import type { ApiResponse } from "@/types/api.types";
import type { AppSettings, SettingsUpdatePayload } from "@/types/settings.types";

/**
 * Espone stato e azioni per gestire impostazioni con sorgente verita condivisa nello store.
 */
export function useSettings() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const apiClient = useMemo(() => createApiClient(), []);
  const settings = useSettingsStore((state) => state.settings);
  const setSettings = useSettingsStore((state) => state.setSettings);

  /**
   * Carica le impostazioni dal backend e aggiorna lo store globale.
   */
  const fetchSettings = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await apiClient.get<ApiResponse<AppSettings>>("/settings");

      if (!response.data.ok) {
        setErrorMessage(response.data.error);
        return;
      }

      setSettings(response.data.data);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      setErrorMessage(axiosError.message || "Errore durante il caricamento impostazioni");
    } finally {
      setIsLoading(false);
    }
  }, [apiClient, setSettings]);

  /**
   * Salva le impostazioni via API e aggiorna lo store locale con il risultato persistito.
   */
  const updateSettings = useCallback(
    async (payload: SettingsUpdatePayload): Promise<boolean> => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await apiClient.put<ApiResponse<AppSettings>>("/settings", payload);

        if (!response.data.ok) {
          setErrorMessage(response.data.error);
          return false;
        }

        setSettings(response.data.data);
        return true;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        setErrorMessage(axiosError.message || "Errore durante il salvataggio impostazioni");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [apiClient, setSettings],
  );

  return {
    settings,
    isLoading,
    errorMessage,
    fetchSettings,
    updateSettings,
  };
}
