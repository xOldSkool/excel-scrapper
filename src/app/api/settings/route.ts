/*
 * Questo file espone le API route per leggere e salvare le impostazioni applicative.
 */

import { ZodError } from "zod";

import { getErrorMessage } from "@/lib/error";
import { createErrorResponse, createSuccessResponse } from "@/lib/http";
import { getSettings, saveSettings } from "@/lib/logic";
import { settingsSchema } from "@/types/schemas.types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Restituisce le impostazioni correnti usate dal backend per leggere il file Excel.
 */
export async function GET() {
  try {
    const settings = await getSettings();

    return createSuccessResponse(settings);
  } catch (error: unknown) {
    return createErrorResponse(getErrorMessage(error), 500);
  }
}

/**
 * Valida e persiste le impostazioni inviate dal client tramite payload JSON.
 */
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsedSettings = settingsSchema.parse(body);
    const savedSettings = await saveSettings(parsedSettings);

    return createSuccessResponse(savedSettings);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return createErrorResponse(error.issues.map((issue) => issue.message).join("; "), 400);
    }

    return createErrorResponse(getErrorMessage(error), 500);
  }
}
