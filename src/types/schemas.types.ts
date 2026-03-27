/*
 * Questo file raccoglie gli schemi Zod usati nelle API route e i relativi tipi inferiti.
 */

import { z } from "zod";

import { MAINTENANCE_PRIORITIES } from "@/types/maintenance.types";

export const settingsSchema = z.object({
  excelFilePath: z.string().trim().min(1, "Il percorso del file e obbligatorio"),
  sheetName: z.string().trim().min(1, "Il nome foglio e obbligatorio"),
});

export const maintenanceStatusSchema = z.object({
  stato: z.string().trim().min(1, "Il valore stato e obbligatorio"),
});

export const maintenancePrioritySchema = z.enum(MAINTENANCE_PRIORITIES);

export type SettingsSchemaInput = z.infer<typeof settingsSchema>;
export type MaintenanceStatusSchemaInput = z.infer<typeof maintenanceStatusSchema>;
