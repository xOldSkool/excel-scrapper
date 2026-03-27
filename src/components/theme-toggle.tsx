/*
 * Questo file definisce il toggle tema chiaro/scuro con persistenza locale e sincronizzazione della classe dark.
 */

"use client";

import { useEffect } from "react";
import { SunMoon } from "lucide-react";

const THEME_STORAGE_KEY = "excel-scrapper-theme";

/**
 * Applica il tema richiesto aggiornando classe html e color-scheme browser.
 */
function applyTheme(theme: "light" | "dark"): void {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
}

/**
 * Legge il tema salvato in localStorage oppure calcola il fallback da preferenze sistema.
 */
function resolveInitialTheme(): "light" | "dark" {
  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/**
 * Renderizza il bottone toggle per cambiare tema tra modalita chiara e scura.
 */
export function ThemeToggle() {
  useEffect(() => {
    const initialTheme = resolveInitialTheme();
    applyTheme(initialTheme);
  }, []);

  /**
   * Inverte il tema corrente leggendo lo stato reale della classe html e salva la scelta utente.
   */
  function handleToggleTheme(): void {
    const isDarkEnabled = document.documentElement.classList.contains("dark");
    const nextTheme = isDarkEnabled ? "light" : "dark";
    applyTheme(nextTheme);
    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  }

  return (
    <button
      type="button"
      onClick={handleToggleTheme}
      className="rounded-md border border-zinc-300 bg-white px-3 py-2 text-zinc-700 transition hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
      aria-label="Cambia tema"
      title="Cambia tema"
    >
      <SunMoon aria-hidden="true" className="size-5" />
    </button>
  );
}
