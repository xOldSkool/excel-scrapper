/*
 * Questo file implementa le operazioni CRUD di persistenza per impostazioni e dati manutenzioni su file Excel.
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import * as XLSX from "xlsx";

import {
  DEFAULT_MAINTENANCE_STATUSES,
  MAINTENANCE_PRIORITIES,
  type MaintenanceDataset,
  type MaintenancePriority,
  type MaintenanceSheetRow,
  type MaintenanceStatus,
} from "@/types/maintenance.types";
import {
  DEFAULT_SETTINGS,
  type AppSettings,
  type SettingsUpdatePayload,
} from "@/types/settings.types";

const SETTINGS_PATH = path.join(/* turbopackIgnore: true */ process.cwd(), "work", "app-settings.json");

/**
 * Restituisce il percorso assoluto del file Excel in base al valore salvato nelle impostazioni.
 */
function resolveExcelPath(excelFilePath: string): string {
  if (path.isAbsolute(excelFilePath)) {
    return excelFilePath;
  }

  return path.join(/* turbopackIgnore: true */ process.cwd(), excelFilePath);
}

/**
 * Normalizza una cella generica in stringa coerente per il layer applicativo.
 */
function normalizeCellValue(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
}

/**
 * Cerca una colonna nel foglio usando confronto case-insensitive.
 */
function findColumnKey(columns: string[], columnName: string): string | undefined {
  return columns.find((column) => column.trim().toLowerCase() === columnName.trim().toLowerCase());
}

/**
 * Estrae dinamicamente la lista intestazioni dal foglio mantenendo l'ordine originale.
 */
function getWorksheetColumns(worksheet: XLSX.WorkSheet): string[] {
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(worksheet, {
    header: 1,
    raw: false,
    defval: "",
  });

  const headerRow = matrix[0] ?? [];

  return headerRow
    .map((cell) => normalizeCellValue(cell))
    .filter((column, index, source) => column.length > 0 && source.indexOf(column) === index);
}

/**
 * Restituisce le righe oggetto del foglio come base per normalizzazione e update.
 */
function getWorksheetRows(worksheet: XLSX.WorkSheet): MaintenanceSheetRow[] {
  return XLSX.utils.sheet_to_json<MaintenanceSheetRow>(worksheet, {
    defval: "",
    raw: false,
  });
}

/**
 * Calcola i nomi colonna principali usati dall'app mappandoli a quelli realmente presenti nel file.
 */
function resolveColumnMap(columns: string[]) {
  const idColumn = findColumnKey(columns, "id") ?? "id";
  const deadlineColumn = findColumnKey(columns, "scadenza") ?? "scadenza";
  const plantColumn = findColumnKey(columns, "stabilimento") ?? "stabilimento";
  const detailsColumn = findColumnKey(columns, "dettagli") ?? "dettagli";
  const priorityColumn = findColumnKey(columns, "priorita") ?? "priorita";
  const statusColumn = findColumnKey(columns, "stato") ?? "stato";

  return {
    idColumn,
    deadlineColumn,
    plantColumn,
    detailsColumn,
    priorityColumn,
    statusColumn,
  };
}

/**
 * Estrae i valori disponibili per lo stato dal foglio evitando duplicati e stringhe vuote.
 */
function extractStatusOptions(rows: MaintenanceSheetRow[], statusColumn: string): string[] {
  const uniqueStatusValues = new Set<string>();

  rows.forEach((row) => {
    const statusValue = normalizeCellValue(row[statusColumn]);

    if (statusValue.length > 0) {
      uniqueStatusValues.add(statusValue);
    }
  });

  if (uniqueStatusValues.size === 0) {
    return [...DEFAULT_MAINTENANCE_STATUSES];
  }

  return [...uniqueStatusValues];
}

/**
 * Converte una riga grezza in record standard mantenendo anche i campi dinamici del foglio.
 */
function normalizeSheetRow(
  row: MaintenanceSheetRow,
  index: number,
  columns: string[],
  columnMap: ReturnType<typeof resolveColumnMap>,
  statusOptions: string[],
) {
  const normalizedDynamicValues: Record<string, string> = {};

  columns.forEach((columnName) => {
    normalizedDynamicValues[columnName] = normalizeCellValue(row[columnName]);
  });

  const priorityCandidate = normalizeCellValue(row[columnMap.priorityColumn]);
  const statusCandidate = normalizeCellValue(row[columnMap.statusColumn]);
  const fallbackStatus = statusOptions[0] ?? DEFAULT_MAINTENANCE_STATUSES[0];

  const priority: MaintenancePriority = MAINTENANCE_PRIORITIES.includes(priorityCandidate as MaintenancePriority)
    ? (priorityCandidate as MaintenancePriority)
    : "Media";

  return {
    ...normalizedDynamicValues,
    id: normalizeCellValue(row[columnMap.idColumn]) || `row-${index + 1}`,
    scadenza: normalizeCellValue(row[columnMap.deadlineColumn]),
    stabilimento: normalizeCellValue(row[columnMap.plantColumn]),
    dettagli: normalizeCellValue(row[columnMap.detailsColumn]),
    priorita: priority,
    stato: statusCandidate || fallbackStatus,
  };
}

/**
 * Garantisce che la directory di work esista prima di salvare impostazioni o altri file applicativi.
 */
async function ensureWorkDirectory(): Promise<void> {
  await mkdir(path.join(/* turbopackIgnore: true */ process.cwd(), "work"), { recursive: true });
}

/**
 * Carica le impostazioni dal file JSON locale o ritorna i default se il file non esiste ancora.
 */
export async function readSettings(): Promise<AppSettings> {
  if (!existsSync(SETTINGS_PATH)) {
    return DEFAULT_SETTINGS;
  }

  const fileContent = await readFile(SETTINGS_PATH, "utf-8");
  const parsed = JSON.parse(fileContent) as Partial<AppSettings>;

  return {
    excelFilePath: parsed.excelFilePath?.trim() || DEFAULT_SETTINGS.excelFilePath,
    sheetName: parsed.sheetName?.trim() || DEFAULT_SETTINGS.sheetName,
  };
}

/**
 * Salva le impostazioni applicative su file locale per renderle persistenti tra i riavvii.
 */
export async function writeSettings(settings: SettingsUpdatePayload): Promise<AppSettings> {
  await ensureWorkDirectory();

  const normalizedSettings: AppSettings = {
    excelFilePath: settings.excelFilePath.trim(),
    sheetName: settings.sheetName.trim(),
  };

  await writeFile(SETTINGS_PATH, `${JSON.stringify(normalizedSettings, null, 2)}\n`, "utf-8");

  return normalizedSettings;
}

/**
 * Legge il workbook dal percorso configurato usando fs/promises e parsing buffer.
 */
async function readWorkbookBySettings(settings: AppSettings): Promise<XLSX.WorkBook> {
  const workbookPath = resolveExcelPath(settings.excelFilePath);

  if (!existsSync(workbookPath)) {
    throw new Error(`File Excel non trovato: ${workbookPath}`);
  }

  const workbookBuffer = await readFile(workbookPath);

  return XLSX.read(workbookBuffer, { type: "buffer" });
}

/**
 * Restituisce dataset completo con righe, intestazioni e opzioni dinamiche dello stato.
 */
export async function readMaintenanceDataset(settings: AppSettings): Promise<MaintenanceDataset> {
  const workbook = await readWorkbookBySettings(settings);
  const worksheet = workbook.Sheets[settings.sheetName];

  if (!worksheet) {
    throw new Error(`Foglio non trovato nel workbook: ${settings.sheetName}`);
  }

  const rows = getWorksheetRows(worksheet);
  const columns = getWorksheetColumns(worksheet);
  const columnMap = resolveColumnMap(columns);
  const statusOptions = extractStatusOptions(rows, columnMap.statusColumn);
  const normalizedRows = rows.map((row, index) => normalizeSheetRow(row, index, columns, columnMap, statusOptions));

  return {
    rows: normalizedRows,
    columns: columns.length > 0 ? columns : [
      columnMap.idColumn,
      columnMap.deadlineColumn,
      columnMap.plantColumn,
      columnMap.detailsColumn,
      columnMap.priorityColumn,
      columnMap.statusColumn,
    ],
    statusOptions,
    statusColumn: columnMap.statusColumn,
  };
}

/**
 * Aggiorna lo stato del record identificato da id e riscrive l'intero foglio su disco.
 */
export async function updateMaintenanceStatus(
  settings: AppSettings,
  id: string,
  stato: MaintenanceStatus,
): Promise<void> {
  const workbookPath = resolveExcelPath(settings.excelFilePath);
  const workbook = await readWorkbookBySettings(settings);
  const worksheet = workbook.Sheets[settings.sheetName];

  if (!worksheet) {
    throw new Error(`Foglio non trovato nel workbook: ${settings.sheetName}`);
  }

  const rows = getWorksheetRows(worksheet);
  const columns = getWorksheetColumns(worksheet);
  const columnMap = resolveColumnMap(columns);
  const statusOptions = extractStatusOptions(rows, columnMap.statusColumn);

  if (!statusOptions.includes(stato)) {
    throw new Error(`Valore stato non valido per il foglio corrente: ${stato}`);
  }

  const targetRowIndex = rows.findIndex(
    (row) => normalizeCellValue(row[columnMap.idColumn]) === id,
  );

  if (targetRowIndex < 0) {
    throw new Error(`Record non trovato con id: ${id}`);
  }

  rows[targetRowIndex] = {
    ...rows[targetRowIndex],
    [columnMap.statusColumn]: stato,
  };

  const nextWorksheet = XLSX.utils.json_to_sheet(rows, {
    header: columns.length > 0 ? columns : undefined,
  });
  workbook.Sheets[settings.sheetName] = nextWorksheet;
  const workbookBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  await writeFile(workbookPath, workbookBuffer);
}
