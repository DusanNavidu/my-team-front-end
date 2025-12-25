import React from "react";

export interface TableColumn<T> {
  label: string;
  key?: keyof T;
  align?: "left" | "center" | "right";
  render?: (row: T, index: number) => React.ReactNode;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  data: T[];
  emptyText?: string;
}

export default function Table<T>({
  columns,
  data,
  emptyText = "No data found",
}: TableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`py-3 px-6 text-sm font-medium text-gray-700 text-${col.align ?? "left"}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="py-6 text-center text-gray-500"
              >
                {emptyText}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b hover:bg-gray-50 transition"
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    className={`py-3 px-6 text-sm text-gray-800 text-${col.align ?? "left"}`}
                  >
                    {col.render
                      ? col.render(row, rowIndex)
                      : col.key
                      ? String(row[col.key])
                      : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
