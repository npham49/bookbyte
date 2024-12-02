"use client";
import { getAllBooksAction } from "@/data-access/actions/book.actions";
import { Book } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

export default function AdminBookList({
  initialData,
}: {
  initialData: Book[];
}) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const response = await getAllBooksAction();
      if (!response) {
        throw new Error("Failed to fetch books");
      }
      return response.data;
    },
    initialData: initialData,
  });

  return (
    <div>
      <DataTable data={data} columns={columns} />
    </div>
  );
}
