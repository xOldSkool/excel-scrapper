/*
 * Questo file definisce il layout globale dell'applicazione, includendo metadata, font e header condiviso.
 */

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppHeader } from "@/components/app-header";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Excel Scrapper Manutenzioni",
  description: "Dashboard manutenzioni da file Excel con gestione stato e impostazioni.",
};

/**
 * Renderizza il contenitore base dell'app con header persistente e area contenuti.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AppHeader />
        <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-6 md:px-6">{children}</main>
      </body>
    </html>
  );
}
