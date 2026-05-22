"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DollarSign, Mail, Text } from "lucide-react";
import * as React from "react";

import { Badge } from "@repo/ui/badge";
import {
  DataTable,
  DataTableAdvancedToolbar,
  DataTableColumnHeader,
  DataTableFilterList,
  DataTableSortList,
  useDataTable,
} from "@repo/ui/data-table";

type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const payments: Payment[] = [
  {
    id: "728ed52f",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "489e1d42",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
  {
    id: "489e1d43",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  {
    id: "489e1d44",
    amount: 874,
    status: "success",
    email: "Silas22@example.com",
  },
  {
    id: "489e1d45",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
  {
    id: "489e1d46",
    amount: 150,
    status: "pending",
    email: "olivia@example.com",
  },
  {
    id: "489e1d47",
    amount: 420,
    status: "processing",
    email: "jackson@example.com",
  },
  {
    id: "489e1d48",
    amount: 990,
    status: "success",
    email: "mia@example.com",
  },
];

function statusLabel(
  status: Payment["status"],
  isRtl: boolean,
): string {
  if (isRtl) {
    const ar: Record<Payment["status"], string> = {
      success: "ناجح",
      processing: "قيد المعالجة",
      pending: "قيد الانتظار",
      failed: "فشل",
    };
    return ar[status];
  }
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function DataTableDemo({ isRtl }: { isRtl: boolean }) {
  const columns = React.useMemo<ColumnDef<Payment>[]>(
    () => [
      {
        id: "status",
        accessorKey: "status",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            label={isRtl ? "الحالة" : "Status"}
          />
        ),
        cell: ({ row }) => (
          <Badge variant="outline">
            {statusLabel(row.original.status, isRtl)}
          </Badge>
        ),
        meta: {
          label: isRtl ? "الحالة" : "Status",
          variant: "select",
          options: [
            { label: isRtl ? "ناجح" : "Success", value: "success" },
            { label: isRtl ? "قيد المعالجة" : "Processing", value: "processing" },
            { label: isRtl ? "قيد الانتظار" : "Pending", value: "pending" },
            { label: isRtl ? "فشل" : "Failed", value: "failed" },
          ],
        },
        enableColumnFilter: true,
        enableSorting: true,
      },
      {
        id: "email",
        accessorKey: "email",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            label={isRtl ? "البريد الإلكتروني" : "Email"}
          />
        ),
        cell: ({ row }) => <div>{row.getValue("email")}</div>,
        meta: {
          label: isRtl ? "البريد" : "Email",
          placeholder: isRtl ? "ابحث في البريد..." : "Search emails...",
          variant: "text",
          icon: Mail,
        },
        enableColumnFilter: true,
        enableSorting: true,
      },
      {
        id: "amount",
        accessorKey: "amount",
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            label={isRtl ? "المبلغ" : "Amount"}
          />
        ),
        cell: ({ row }) =>
          new Intl.NumberFormat(isRtl ? "ar-SA" : "en-US", {
            style: "currency",
            currency: "USD",
          }).format(row.original.amount),
        meta: {
          label: isRtl ? "المبلغ" : "Amount",
          variant: "number",
          unit: "$",
          icon: DollarSign,
        },
        enableColumnFilter: true,
        enableSorting: true,
      },
      {
        id: "id",
        accessorKey: "id",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} label="ID" />
        ),
        meta: {
          label: "ID",
          placeholder: "Search IDs...",
          variant: "text",
          icon: Text,
        },
        enableColumnFilter: true,
        enableHiding: true,
      },
    ],
    [isRtl],
  );

  const pageCount = Math.ceil(payments.length / 3);

  const { table } = useDataTable({
    data: payments,
    columns,
    pageCount,
    mode: "client",
    enableAdvancedFilter: true,
    getRowId: (row) => row.id,
    initialState: {
      sorting: [{ id: "amount", desc: true }],
      pagination: { pageIndex: 0, pageSize: 3 },
    },
  });

  return (
    <div dir={isRtl ? "rtl" : "ltr"} className="w-full max-w-4xl">
      <DataTable table={table}>
        <DataTableAdvancedToolbar table={table}>
          <DataTableFilterList table={table} />
          <DataTableSortList table={table} />
        </DataTableAdvancedToolbar>
      </DataTable>
    </div>
  );
}
