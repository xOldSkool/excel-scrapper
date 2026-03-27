/*
 * Questo file implementa il form impostazioni con React Hook Form e salvataggio via API.
 */

"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useSettings } from "@/hooks/use-settings";
import type { AppSettings } from "@/types/settings.types";

/**
 * Renderizza il form impostazioni per percorso file Excel e nome foglio di lettura.
 */
export function SettingsForm() {
  const { settings, isLoading, errorMessage, fetchSettings, updateSettings } = useSettings();
  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<AppSettings>({
    defaultValues: settings,
  });

  useEffect(() => {
    /**
     * Sincronizza i valori del form con quelli presenti nello store globale.
     */
    reset(settings);
  }, [settings, reset]);

  useEffect(() => {
    /**
     * Carica dal backend le impostazioni correnti al primo rendering della pagina.
     */
    void fetchSettings();
  }, [fetchSettings]);

  /**
   * Gestisce il submit del form e mostra un alert semplice in caso di successo.
   */
  const onSubmit = handleSubmit(async (data) => {
    const hasSaved = await updateSettings(data);

    if (hasSaved) {
      window.alert("Impostazioni salvate con successo.");
    }
  });

  return (
    <section className="max-w-2xl rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-zinc-900">Impostazioni sorgente Excel</h2>
      <p className="mt-1 text-sm text-zinc-600">
        Definisci il percorso del file e il nome del foglio da leggere/scrivere.
      </p>

      {errorMessage ? (
        <p className="mt-4 rounded-md border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">{errorMessage}</p>
      ) : null}

      <form className="mt-5 space-y-4" onSubmit={onSubmit}>
        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-800">Percorso file Excel</span>
          <input
            {...register("excelFilePath")}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-600"
            placeholder="data/manutenzioni-italy.xlsx"
          />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-zinc-800">Nome foglio</span>
          <input
            {...register("sheetName")}
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-600"
            placeholder="Scadenze"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading || isSubmitting ? "Salvataggio..." : "Salva impostazioni"}
        </button>
      </form>
    </section>
  );
}
