/*
 * Questo file contiene l'hook client per caricare e aggiornare i record manutenzione tramite API Axios.
 */

"use client";

import { useCallback, useMemo, useState } from "react";

import type { AxiosError } from "axios";

import { createApiClient } from "@/lib/api-client";
import type { ApiResponse } from "@/types/api.types";
import type {
  MaintenanceDataset,
  MaintenanceRecord,
  MaintenanceStatus,
  MaintenanceStatusUpdatePayload,
} from "@/types/maintenance.types";

/**
 * Espone la gestione completa della lista manutenzioni e dell'update stato per singolo record.
 */
export function useMaintenanceData() {
  const [rows, setRows] = useState<MaintenanceRecord[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [statusOptions, setStatusOptions] = useState<string[]>([]);
  const [statusColumn, setStatusColumn] = useState<string>("stato");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const apiClient = useMemo(() => createApiClient(), []);

  /**
   * Carica la lista manutenzioni ordinata dalla route API dedicata.
   */
  const fetchRows = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await apiClient.get<ApiResponse<MaintenanceDataset>>("/manutenzioni");

      if (!response.data.ok) {
        setErrorMessage(response.data.error);
        return;
      }

      setRows(response.data.data.rows);
      setColumns(response.data.data.columns);
      setStatusOptions(response.data.data.statusOptions);
      setStatusColumn(response.data.data.statusColumn);
    } catch (error: unknown) {
      const axiosError = error as AxiosError;
      setErrorMessage(axiosError.message || "Errore durante il caricamento manutenzioni");
    } finally {
      setIsLoading(false);
    }
  }, [apiClient]);

  /**
   * Aggiorna lo stato di un singolo record e sincronizza la tabella con i dati aggiornati.
   */
  const patchStatus = useCallback(
    async (id: string, stato: MaintenanceStatus): Promise<boolean> => {
      setErrorMessage("");

      try {
        const payload: MaintenanceStatusUpdatePayload = { stato };
        const response = await apiClient.patch<ApiResponse<MaintenanceDataset>>(
          `/manutenzioni/${id}/stato`,
          payload,
        );

        if (!response.data.ok) {
          setErrorMessage(response.data.error);
          return false;
        }

        setRows(response.data.data.rows);
        setColumns(response.data.data.columns);
        setStatusOptions(response.data.data.statusOptions);
        setStatusColumn(response.data.data.statusColumn);
        return true;
      } catch (error: unknown) {
        const axiosError = error as AxiosError;
        setErrorMessage(axiosError.message || "Errore durante l'aggiornamento stato");
        return false;
      }
    },
    [apiClient],
  );

  return {
    rows,
    columns,
    statusOptions,
    statusColumn,
    isLoading,
    errorMessage,
    fetchRows,
    patchStatus,
  };
}
