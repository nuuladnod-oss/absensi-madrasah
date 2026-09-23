import React from 'react';

export interface ResponsiveTableProps<T> {
  /** Table rows. */
  data: T[];
  /** Column definitions. */
  columns: Array<{
    key: string;
    header: string;
    /** Render cell content. Receives the row. */
    render: (row: T) => React.ReactNode;
    /** Optional extra classes for the cell (e.g. text-right for numbers). */
    className?: string;
    /** Optional: hide column on mobile. */
    hideOnMobile?: boolean;
  }>;
  /** Optional key extractor for stable row keys. */
  getRowKey: (row: T, index: number) => string;
  /** Optional empty state content rendered when data is empty. */
  emptyState?: React.ReactNode;
  /** Optional extra Tailwind classes for the wrapper. */
  className?: string;
  /** Optional caption for accessibility. */
  caption?: string;
}

/**
 * Responsive table.
 * Desktop: full-width table with horizontal scroll fallback on overflow.
 * Mobile: horizontal scroll container (no layout break at 390x844).
 * No data fetching, no business logic.
 */
export function ResponsiveTable<T>({
  data,
  columns,
  getRowKey,
  emptyState,
  className = '',
  caption,
}: ResponsiveTableProps<T>) {
  if (data.length === 0) {
    return (
      <div className={`rounded-xl border border-slate-200 bg-white p-6 ${className}`}>
        {emptyState ?? (
          <p className="text-sm text-slate-500 text-center">
            Belum ada data.
          </p>
        )}
      </div>
    );
  }

  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white overflow-hidden shadow-xs ${className}`}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          {caption && <caption className="sr-only">{caption}</caption>}
          <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-500 border-b border-slate-200">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`py-3.5 px-4 ${col.hideOnMobile ? 'hidden sm:table-cell' : ''}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {data.map((row, index) => (
              <tr key={getRowKey(row, index)} className="hover:bg-slate-50/70 transition">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`py-3 px-4 ${col.className ?? ''} ${col.hideOnMobile ? 'hidden sm:table-cell' : ''}`}
                  >
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResponsiveTable;