/*
 * Questo file implementa la dashboard client che collega hook API e componente tabella.
 */

"use client";

import { useCallback, useEffect } from "react";

import { useMaintenanceData } from "@/hooks/use-maintenance-data";
import { MaintenanceTable } from "@/components/maintenance-table";
import { type MaintenanceStatus } from "@/types/maintenance.types";

/**
 * Renderizza la vista principale con caricamento dati, error handling e tabella interattiva.
 */
export function DashboardClient() {
  const {
    rows,
    columns,
    statusOptions,
    statusColumn,
    isLoading,
    errorMessage,
    fetchRows,
    patchStatus,
  } = useMaintenanceData();

  useEffect(() => {
    /**
     * Avvia il caricamento iniziale dei dati quando la dashboard viene montata.
     */
    void fetchRows();
  }, [fetchRows]);

  /**
   * Esegue l'aggiornamento dello stato della riga selezionata mantenendo la UI sincronizzata.
   */
  const handleStatusChange = useCallback(
    async (id: string, nextStatus: MaintenanceStatus): Promise<void> => {
      await patchStatus(id, nextStatus);
    },
    [patchStatus],
  );

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">Scadenze manutenzioni</h2>
        <p className="mt-1 text-sm text-zinc-900 dark:text-zinc-200">
          Tabella ordinata di default dalla scadenza piu vicina alla piu lontana.
        </p>
      </div>

      {errorMessage ? (
        <p className="rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorMessage}</p>
      ) : null}

      {isLoading ? <p className="text-sm text-zinc-600">Caricamento dati in corso...</p> : null}

      <MaintenanceTable
        rows={rows}
        columns={columns}
        statusOptions={statusOptions}
        statusColumn={statusColumn}
        onStatusChange={handleStatusChange}
      />
    </section>
  );
}
