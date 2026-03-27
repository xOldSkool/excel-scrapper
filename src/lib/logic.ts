/*
 * Questo file implementa la logica di business tra API route e layer di persistenza.
 */

import {
  readMaintenanceDataset,
  readSettings,
  updateMaintenanceStatus,
  writeSettings,
} from "@/lib/db";
import {
  type MaintenanceDataset,
  type MaintenanceStatus,
} from "@/types/maintenance.types";
import {
  type AppSettings,
  type SettingsUpdatePayload,
} from "@/types/settings.types";

/**
 * Converte una data testuale in timestamp numerico per il confronto ordinato.
 */
function toDateScore(value: string): number {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return Number.POSITIVE_INFINITY;
  }

  return parsed.getTime();
}

/**
 * Ordina i record dalla scadenza piu vicina alla piu lontana.
 */
function sortByNearestDeadline(records: MaintenanceRecord[]): MaintenanceRecord[] {
  return [...records].sort((left, right) => toDateScore(left.scadenza) - toDateScore(right.scadenza));
}

/**
 * Restituisce le impostazioni correnti dal layer di persistenza.
 */
export async function getSettings(): Promise<AppSettings> {
  return readSettings();
}

/**
 * Valida e persiste le impostazioni applicative.
 */
export async function saveSettings(settingsPayload: SettingsUpdatePayload): Promise<AppSettings> {
  return writeSettings(settingsPayload);
}

/**
 * Carica il dataset manutenzioni completo mantenendo ordinamento default per scadenza.
 */
export async function getSortedMaintenanceDataset(): Promise<MaintenanceDataset> {
  const settings = await readSettings();
  const dataset = await readMaintenanceDataset(settings);

  return {
    ...dataset,
    rows: sortByNearestDeadline(dataset.rows),
  };
}

/**
 * Aggiorna lo stato di un record nel foglio e ritorna la lista aggiornata e ordinata.
 */
export async function changeMaintenanceStatus(
  id: string,
  stato: MaintenanceStatus,
): Promise<MaintenanceDataset> {
  const settings = await readSettings();

  await updateMaintenanceStatus(settings, id, stato);

  const updatedDataset = await readMaintenanceDataset(settings);

  return {
    ...updatedDataset,
    rows: sortByNearestDeadline(updatedDataset.rows),
  };
}
