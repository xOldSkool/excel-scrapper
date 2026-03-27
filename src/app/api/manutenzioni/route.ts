/*
 * Questo file espone la route API per leggere la lista manutenzioni ordinata per scadenza.
 */

import { getErrorMessage } from "@/lib/error";
import { createErrorResponse, createSuccessResponse } from "@/lib/http";
import { getSortedMaintenanceDataset } from "@/lib/logic";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Restituisce la lista delle manutenzioni ordinata dalla scadenza piu vicina alla piu lontana.
 */
export async function GET() {
  try {
    const dataset = await getSortedMaintenanceDataset();

    return createSuccessResponse(dataset);
  } catch (error: unknown) {
    return createErrorResponse(getErrorMessage(error), 500);
  }
}
