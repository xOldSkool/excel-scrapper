/*
 * Questo file definisce i tipi standard delle risposte API per uniformare la comunicazione client-server.
 */

export type ApiSuccess<TData> = {
  ok: true;
  data: TData;
};

export type ApiFailure = {
  ok: false;
  error: string;
};

export type ApiResponse<TData> = ApiSuccess<TData> | ApiFailure;
