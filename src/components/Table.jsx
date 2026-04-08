import React from 'react'

export default function Table({ columns, data, emptyMessage = 'No data found' }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/5">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left text-white/30 text-xs font-semibold uppercase tracking-wider py-3 px-4 first:pl-0 last:pr-0"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="text-center text-white/20 py-12 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={row.id || i}
                className="border-b border-white/5 hover:bg-white/2 transition-colors group"
              >
                {columns.map((col) => (
                  <td key={col.key} className="py-3.5 px-4 first:pl-0 last:pr-0 text-white/70">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
