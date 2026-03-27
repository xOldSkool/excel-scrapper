/*
 * Questo file contiene utility per normalizzare gli errori in messaggi leggibili e sicuri da esporre.
 */

/**
 * Estrae un messaggio stringa da un errore sconosciuto senza usare il tipo any.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Errore non previsto";
}
