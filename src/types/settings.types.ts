/*
 * Questo file centralizza i tipi e i valori di default relativi alle impostazioni applicative.
 */

export type AppSettings = {
  excelFilePath: string;
  sheetName: string;
};

export const DEFAULT_SETTINGS: AppSettings = {
  excelFilePath: "manutenzioni-italy.xlsx",
  sheetName: "Scadenze",
};

export type SettingsUpdatePayload = AppSettings;
