<!--
Questo file README descrive lo scopo del progetto, le funzionalita principali e i passaggi per eseguirlo in locale.
-->

# Excel Scrapper - Dashboard Manutenzioni

## Cosa fa questo progetto

Questa applicazione web legge dati da un file Excel multi-foglio e mostra una tabella di manutenzioni.

Funzionalita principali:

- Lettura dati dal foglio Excel configurato.
- Tabella ordinata di default per scadenza dalla piu vicina alla piu lontana.
- Ordinamento per colonne.
- Ricerca globale su tutte le colonne.
- Modifica dello stato di ogni riga direttamente dalla tabella.
- Scrittura della modifica stato nel file Excel.
- Pagina Impostazioni per scegliere:
  - percorso file Excel
  - nome foglio da usare
- Tema chiaro/scuro con toggle in header.

Stack principale:

- Next.js App Router
- TypeScript strict
- Tailwind CSS
- Zod
- Zustand
- Axios
- React Hook Form
- SheetJS
- TanStack Table

## Come copiarlo e avviarlo sul tuo PC

### 1. Prerequisiti

Assicurati di avere:

- Git installato
- Node.js 20 o superiore
- npm (incluso con Node.js)

### 2. Clona il repository

Esegui nel terminale:

`git clone URL_REPOSITORY`

`cd excel-scrapper`

### 3. Installa le dipendenze

`npm install`

### 4. Avvia il progetto in sviluppo

`npm run dev`

Poi apri nel browser:

http://localhost:3000


## Dati Excel e impostazioni

- File di esempio incluso: data/manutenzioni-italy.xlsx
- Foglio principale usato di default: Scadenze
- Percorso predefinito nel campo Impostazioni > Percorso file Excel: data/manutenzioni-italy.xlsx
- Le impostazioni salvate dall'app vengono persistite localmente in data/app-settings.json
- Il file app-settings.json viene creato al primo salvataggio dalla pagina Impostazioni

Se vuoi usare un file diverso:

1. Apri la pagina Impostazioni.
2. Inserisci percorso file e nome foglio.
3. Salva.