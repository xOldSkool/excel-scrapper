/*
 * Questo file espone la route API per aggiornare lo stato di una manutenzione specifica.
 */

import { ZodError } from "zod";

import { getErrorMessage } from "@/lib/error";
import { createErrorResponse, createSuccessResponse } from "@/lib/http";
import { changeMaintenanceStatus } from "@/lib/logic";
import { maintenanceStatusSchema } from "@/types/schemas.types";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Aggiorna lo stato del record identificato da id e restituisce dataset aggiornato.
 */
export async function PATCH(
  request: Request,
  context: RouteContext<"/api/manutenzioni/[id]/stato">,
) {
  try {
    const body = await request.json();
    const payload = maintenanceStatusSchema.parse(body);
    const params = await context.params;
    const updatedRecords = await changeMaintenanceStatus(params.id, payload.stato);

    return createSuccessResponse(updatedRecords);
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      return createErrorResponse(error.issues.map((issue) => issue.message).join("; "), 400);
    }

    return createErrorResponse(getErrorMessage(error), 500);
  }
}
