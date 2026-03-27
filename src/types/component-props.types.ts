/*
 * Questo file centralizza i tipi props dei componenti React per mantenere i file UI puliti.
 */

import type { MaintenanceRecord } from "@/types/maintenance.types";

export type MaintenanceTableProps = {
  rows: MaintenanceRecord[];
  columns: string[];
  statusOptions: string[];
  statusColumn: string;
  onStatusChange: (id: string, nextStatus: string) => Promise<void>;
};
