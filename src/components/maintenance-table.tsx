/*
 * Questo file contiene la tabella manutenzioni con ricerca globale, ordinamento colonne e update stato in linea.
 */

"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type ColumnDef,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import type { MaintenanceRecord } from "@/types/maintenance.types";
import type { MaintenanceTableProps } from "@/types/component-props.types";

/**
 * Trasforma il nome colonna rendendo maiuscola solo la prima lettera visualizzata.
 */
function formatColumnHeader(columnName: string): string {
  if (columnName.length === 0) {
    return columnName;
  }

  return `${columnName.charAt(0).toUpperCase()}${columnName.slice(1)}`;
}

/**
 * Renderizza la tabella dati con supporto nativo a sorting e filtro globale.
 */
export function MaintenanceTable({
  rows,
  columns,
  statusOptions,
  statusColumn,
  onStatusChange,
}: MaintenanceTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  /**
   * Definisce le colonne visualizzate e la gestione editing dello stato in tabella.
   */
  const tableColumns = useMemo<ColumnDef<MaintenanceRecord>[]>(
    () =>
      columns.map((columnName) => {
        const isStatusColumn = columnName.trim().toLowerCase() === statusColumn.trim().toLowerCase();

        return {
          id: columnName,
          accessorFn: (row) => row[columnName] ?? "",
          header: formatColumnHeader(columnName),
          cell: ({ row }) => {
            if (!isStatusColumn) {
              return row.original[columnName] ?? "";
            }

            const selectedStatus = row.original[columnName] || row.original.stato;

            return (
              <select
                className="w-full rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm"
                value={selectedStatus}
                onChange={async (event) => {
                  await onStatusChange(row.original.id, event.target.value);
                }}
              >
                {statusOptions.map((statusOption) => (
                  <option key={statusOption} value={statusOption}>
                    {statusOption}
                  </option>
                ))}
              </select>
            );
          },
        };
      }),
    [columns, onStatusChange, statusColumn, statusOptions],
  );

  const table = useReactTable({
    data: rows,
    columns: tableColumns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <div className="space-y-3">
      <input
        value={globalFilter}
        onChange={(event) => setGlobalFilter(event.target.value)}
        placeholder="Cerca in tutte le colonne..."
        className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
      />
      <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
        <table className="w-full min-w-[840px] border-collapse text-sm">
          <thead className="bg-zinc-100 text-zinc-900">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="px-3 py-2 text-left font-semibold">
                    {header.isPlaceholder ? null : (
                      <button
                        className="inline-flex items-center gap-1"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <span className="text-xs text-zinc-500">
                          {header.column.getIsSorted() === "asc" ? "▲" : ""}
                          {header.column.getIsSorted() === "desc" ? "▼" : ""}
                        </span>
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="border-t border-zinc-200">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-3 py-2 align-top text-zinc-800">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td className="px-3 py-8 text-center text-zinc-500" colSpan={columns.length}>
                  Nessun record trovato.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
