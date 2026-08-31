'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Download,
  Filter,
  Eye,
  CheckSquare,
  Square,
  MoreHorizontal,
} from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';

export interface DataGridColumn<T> {
  key: string;
  header: string;
  accessor?: (row: T) => React.ReactNode;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  hiddenDefault?: boolean;
}

export interface DataGridProps<T extends Record<string, unknown>> {
  data: T[];
  columns: DataGridColumn<T>[];
  keyField: string;
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  onRowClick?: (row: T) => void;
  bulkActions?: Array<{
    label: string;
    action: (selectedRows: T[]) => void;
    variant?: 'primary' | 'danger' | 'secondary';
  }>;
}

export function DataGrid<T extends Record<string, unknown>>({
  data,
  columns,
  keyField,
  title,
  subtitle,
  searchPlaceholder = 'Search records...',
  onRowClick,
  bulkActions,
}: DataGridProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
    new Set(columns.filter((c) => !c.hiddenDefault).map((c) => c.key))
  );
  const [columnToggleOpen, setColumnToggleOpen] = useState(false);

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return data;
    const term = searchTerm.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((val) =>
        val !== null && val !== undefined && String(val).toLowerCase().includes(term)
      )
    );
  }, [data, searchTerm]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    return [...filteredData].sort((a, b) => {
      const valA = a[sortColumn];
      const valB = b[sortColumn];
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      const cmp = String(valA).localeCompare(String(valB), undefined, { numeric: true });
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginate data
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  const handleSort = (key: string) => {
    if (sortColumn === key) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      setSortColumn(key);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      const newSet = new Set<string>();
      paginatedData.forEach((row) => newSet.add(String(row[keyField])));
      setSelectedIds(newSet);
    }
  };

  const handleSelectRow = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const toggleColumnVisibility = (key: string) => {
    const newSet = new Set(visibleColumns);
    if (newSet.has(key)) {
      if (newSet.size > 1) newSet.delete(key);
    } else {
      newSet.add(key);
    }
    setVisibleColumns(newSet);
  };

  const exportCSV = () => {
    const activeCols = columns.filter((c) => visibleColumns.has(c.key));
    const header = activeCols.map((c) => `"${c.header}"`).join(',');
    const rows = sortedData.map((row) =>
      activeCols
        .map((c) => {
          const val = row[c.key];
          return `"${String(val ?? '').replace(/"/g, '""')}"`;
        })
        .join(',')
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [header, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `datastream_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedRowsList = useMemo(() => {
    return data.filter((row) => selectedIds.has(String(row[keyField])));
  }, [data, selectedIds, keyField]);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {(title || subtitle) && (
          <div>
            {title && <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto ml-auto">
          {/* Search Input */}
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={searchPlaceholder}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* Column Visibility Selector */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              icon={<Eye className="w-3.5 h-3.5" />}
              onClick={() => setColumnToggleOpen(!columnToggleOpen)}
            >
              Columns
            </Button>
            {columnToggleOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-950 border border-slate-800 rounded-lg shadow-xl p-2 z-30">
                <span className="text-[10px] font-mono text-slate-400 uppercase px-2 py-1 block">Toggle Columns</span>
                {columns.map((col) => (
                  <label
                    key={col.key}
                    className="flex items-center px-2 py-1.5 text-xs text-slate-300 hover:bg-slate-800 rounded cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(col.key)}
                      onChange={() => toggleColumnVisibility(col.key)}
                      className="mr-2 rounded border-slate-700 bg-slate-900 text-brand-600"
                    />
                    {col.header}
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Export Button */}
          <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={exportCSV}>
            Export
          </Button>
        </div>
      </div>

      {/* Bulk Actions Banner */}
      {selectedIds.size > 0 && (
        <div className="bg-brand-950/80 border-b border-brand-800/80 px-4 py-2 flex items-center justify-between text-xs text-brand-200">
          <span>
            Selected <strong className="text-white">{selectedIds.size}</strong> record(s)
          </span>
          <div className="flex items-center gap-2">
            {bulkActions?.map((b, idx) => (
              <Button
                key={idx}
                variant={b.variant || 'secondary'}
                size="sm"
                onClick={() => b.action(selectedRowsList)}
              >
                {b.label}
              </Button>
            ))}
            <Button variant="ghost" size="sm" onClick={() => setSelectedIds(new Set())}>
              Clear selection
            </Button>
          </div>
        </div>
      )}

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead className="bg-slate-950/70 border-b border-slate-800 text-slate-400 font-mono uppercase tracking-wider">
            <tr>
              <th className="p-3 w-10 text-center">
                <button onClick={handleSelectAll} className="text-slate-400 hover:text-slate-200">
                  {selectedIds.size > 0 && selectedIds.size === paginatedData.length ? (
                    <CheckSquare className="w-4 h-4 text-brand-400" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
              </th>
              {columns
                .filter((c) => visibleColumns.has(c.key))
                .map((col) => (
                  <th key={col.key} className="p-3 font-semibold select-none" style={{ width: col.width }}>
                    <div className="flex items-center gap-1.5">
                      <span>{col.header}</span>
                      {col.sortable !== false && (
                        <button
                          onClick={() => handleSort(col.key)}
                          className="hover:text-slate-200 text-slate-500"
                        >
                          <ArrowUpDown className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-slate-300">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="p-8 text-center text-slate-500 italic">
                  No records match search filters.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => {
                const id = String(row[keyField] ?? idx);
                const isSelected = selectedIds.has(id);
                return (
                  <tr
                    key={id}
                    className={`transition-colors hover:bg-slate-800/40 ${
                      isSelected ? 'bg-brand-950/20' : ''
                    } ${onRowClick ? 'cursor-pointer' : ''}`}
                    onClick={() => onRowClick?.(row)}
                  >
                    <td className="p-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleSelectRow(id)} className="text-slate-400 hover:text-slate-200">
                        {isSelected ? <CheckSquare className="w-4 h-4 text-brand-400" /> : <Square className="w-4 h-4" />}
                      </button>
                    </td>
                    {columns
                      .filter((c) => visibleColumns.has(c.key))
                      .map((col) => (
                        <td key={col.key} className="p-3 whitespace-nowrap">
                          {col.accessor ? col.accessor(row) : String(row[col.key] ?? '')}
                        </td>
                      ))}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div>
          Showing {sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to{' '}
          {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} records
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span>Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-slate-900 border border-slate-800 rounded px-2 py-1 text-slate-200"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="px-2 font-mono">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
