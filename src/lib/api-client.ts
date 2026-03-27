/*
 * Questo file crea una singola istanza Axios usata da tutti gli hook client per le chiamate API.
 */

import axios from "axios";

/**
 * Restituisce un client Axios preconfigurato per lavorare con le route API Next.
 */
export function createApiClient() {
  return axios.create({
    baseURL: "/api",
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
