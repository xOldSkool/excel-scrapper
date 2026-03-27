/*
 * Questo file centralizza i tipi dei record manutenzione letti/scritti dal foglio Excel.
 */

export const MAINTENANCE_PRIORITIES = ["Bassa", "Media", "Alta", "Critica"] as const;

export const DEFAULT_MAINTENANCE_STATUSES = [
  "Da fare",
  "In corso",
  "Completato",
  "Bloccato",
] as const;

export type MaintenancePriority = (typeof MAINTENANCE_PRIORITIES)[number];
export type MaintenanceStatus = string;

export type MaintenanceRecord = {
  id: string;
  scadenza: string;
  stabilimento: string;
  dettagli: string;
  priorita: MaintenancePriority;
  stato: MaintenanceStatus;
} & Record<string, string>;

export type MaintenanceDataset = {
  rows: MaintenanceRecord[];
  columns: string[];
  statusOptions: string[];
  statusColumn: string;
};

export type MaintenanceStatusUpdatePayload = {
  stato: MaintenanceStatus;
};

export type MaintenanceSheetRow = Record<string, unknown>;
