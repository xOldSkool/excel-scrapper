/*
 * Questo file espone helper per costruire risposte JSON API consistenti in tutto il progetto.
 */

import { NextResponse } from "next/server";

import type { ApiFailure, ApiSuccess } from "@/types/api.types";

/**
 * Costruisce una risposta di successo tipizzata con payload data.
 */
export function createSuccessResponse<TData>(data: TData, status = 200): NextResponse<ApiSuccess<TData>> {
  return NextResponse.json({ ok: true, data }, { status });
}

/**
 * Costruisce una risposta di errore tipizzata con messaggio esplicito.
 */
export function createErrorResponse(error: string, status = 400): NextResponse<ApiFailure> {
  return NextResponse.json({ ok: false, error }, { status });
}
