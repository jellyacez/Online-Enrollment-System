import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "../components/DashboardLayout";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ChevronUp, ChevronDown } from "lucide-react";
import "../css/index.css";

// AuditLogs component for viewing system audit logs with filtering and sorting
export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/audit");
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error("Error fetching logs:", err);
      }
    };
    fetchLogs();
  }, []);

  const columns = useMemo(
    () => [
      {
        header: "Timestamp",
        accessorKey: "created_at",
        cell: (info) => new Date(info.getValue()).toLocaleString(),
      },
      {
        header: "User",
        accessorFn: (row) =>
          `${row.user_name || "System/Unknown"} (${row.email || "N/A"})`,
        id: "user",
      },
      {
        header: "Action",
        accessorKey: "action",
        cell: (info) => {
          const action = info.getValue();
          let color = "#333";
          if (
            action.includes("CREATE") ||
            action.includes("REGISTER") ||
            action.includes("ENROLL")
          )
            color = "#28a745";
          if (
            action.includes("DELETE") ||
            action.includes("DROP") ||
            action.includes("ARCHIVE") ||
            action.includes("REJECT")
          )
            color = "#dc3545";
          if (
            action.includes("UPDATE") ||
            action.includes("LOGIN") ||
            action.includes("APPROVE")
          )
            color = "#007bff";
          return <strong style={{ color }}>{action}</strong>;
        },
      },
      {
        header: "Details",
        accessorKey: "details",
      },
    ],
    [],
  );

  const table = useReactTable({
    data: logs,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <DashboardLayout>
      <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h1>System Audit Logs</h1>
            <p>Track and view all system activities.</p>
          </div>
          <div style={{ display: "flex", gap: "1rem" }}>
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Search all columns..."
              style={{
                padding: "10px",
                width: "300px",
                borderRadius: "8px",
                border: "1px solid #ccc",
              }}
            />
          </div>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "20px",
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                style={{ background: "#eee", textAlign: "left" }}
              >
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      padding: "10px",
                      borderBottom: "2px solid #ccc",
                      cursor: header.column.getCanSort()
                        ? "pointer"
                        : "default",
                      userSelect: "none",
                    }}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                      {{
                        asc: <ChevronUp size={16} />,
                        desc: <ChevronDown size={16} />,
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            marginTop: "20px",
            paddingTop: "10px",
          }}
        >
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className={`pagination-btn ${table.getCanPreviousPage() ? "active" : "disabled"}`}
          >
            Previous
          </button>

          <span
            style={{
              display: "flex",
              alignItems: "center",
              fontWeight: "bold",
            }}
          >
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount() || 1}
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className={`pagination-btn ${table.getCanNextPage() ? "active" : "disabled"}`}
          >
            Next
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
