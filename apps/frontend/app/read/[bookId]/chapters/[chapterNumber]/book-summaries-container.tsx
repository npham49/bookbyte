"use client";

import { getChapterAndSummaryByNumberAndBookIdAction } from "@/data-access/actions/chapter.action";
import { useQuery } from "@tanstack/react-query";
import ChapterSummaryCarousel from "./chapter-summary-carousel";
import { Book } from "@prisma/client";
import Link from "next/link";

export default function BookSummaryContainer({
  book,
  chapterNumber,
}: {
  book: Book;
  chapterNumber: number;
}) {
  const { data, isPending, isError } = useQuery({
    queryKey: ["chapter", book.id, chapterNumber],
    queryFn: async () => {
      const response = await getChapterAndSummaryByNumberAndBookIdAction(
        book.id,
        Number(chapterNumber)
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
      <Link href={`/read/${book.id}`}>
        <h1 className="text-3xl font-bold text-center absolute top-20 left-0 right-0 z-10">
          {book.name} - {book.author}
        </h1>
      </Link>
      <ChapterSummaryCarousel summary={data.summary} chapter={data} />
    </div>
  );
}
