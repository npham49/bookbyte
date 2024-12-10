"use client";

import { getChapterAndSummaryByNumberAndBookIdAction } from "@/data-access/actions/chapter.action";
import { useQuery } from "@tanstack/react-query";
import ChapterSummaryCarousel from "./chapter-summary-carousel";
import { Book } from "@prisma/client";

export default function BookSummaryContainer({ book }: { book: Book }) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["chapter", book.id, 0],
    queryFn: async () => {
      const response = await getChapterAndSummaryByNumberAndBookIdAction(
        book.id,
        1
      );
      return response.data;
    },
  });

  if (isError) {
    return <div>Error</div>;
  }

  if (isPending || !data?.summary) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>
        {book.name} - {book.author}
      </h1>
      <ChapterSummaryCarousel summary={data.summary} chapter={data} />
    </div>
  );
}
