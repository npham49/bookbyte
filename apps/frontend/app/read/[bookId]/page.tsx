import { getBookByIdAction } from "@/data-access/actions/book.actions";
import { BookHeader } from "./book-header";
import { ChapterList } from "./chapter-list";
import { getChapterAndSummaryByBookIdAction } from "@/data-access/actions/chapter.action";

export default async function Page({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const bookId = (await params).bookId;

  const book = await getBookByIdAction(bookId);

  const chapters = await getChapterAndSummaryByBookIdAction(bookId);

  if (!book.data || !chapters.data) {
    return <div>Error</div>;
  }

  return (
    <div className="min-h-screen">
      <BookHeader book={book.data} />
      <ChapterList chapters={chapters.data} />
    </div>
  );
}
