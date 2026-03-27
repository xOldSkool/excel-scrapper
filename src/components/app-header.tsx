/*
 * Questo file definisce l'header principale con navigazione tra dashboard e pagina impostazioni.
 */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Renderizza la barra superiore dell'app con evidenza della pagina corrente.
 */
export function AppHeader() {
  const pathname = usePathname();

  return (
    <header className="w-full border-b border-amber-200 bg-amber-50/80 backdrop-blur dark:border-zinc-700 dark:bg-zinc-900/80">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <div className="size-3 rounded-full bg-rose-600" />
          <h1 className="text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">Excel Manutenzioni</h1>
        </div>
        <nav className="flex items-center gap-2 text-sm font-medium">
          <Link
            href="/"
            className={`rounded-md px-3 py-2 transition ${pathname === "/" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"}`}
          >
            Dashboard
          </Link>
          <Link
            href="/impostazioni"
            className={`rounded-md px-3 py-2 transition ${pathname === "/impostazioni" ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900" : "text-zinc-700 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800"}`}
          >
            Impostazioni
          </Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
