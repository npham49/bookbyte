"use client";

import { Book } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Book>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => row.original.category.join(", "),
  },
  {
    accessorKey: "fileKey",
    header: "File Key",
  },
  {
    accessorKey: "chapterSeparator",
    header: "Chapter Separator",
  },
  {
    accessorKey: "publication",
    header: "Publication Year",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];
