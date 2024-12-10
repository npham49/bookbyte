"use client";

import { getAllBooksAction } from "@/data-access/actions/book.actions";
import { useQuery } from "@tanstack/react-query";
import { BookCard } from "./book-card";

export default function BookList() {
  const { data, isPending, isError } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const response = await getAllBooksAction();
      return response.data;
    },
  });

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div className="mb-8 container mx-auto">
      <div className="mb-2 text-xl font-bold">Available Books</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 justify-items-center">
        {isPending && <div>Loading...</div>}
        {data?.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
