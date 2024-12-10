import { getBookByIdAction } from "@/data-access/actions/book.actions";
import BookSummaryContainer from "./book-summaries-container";

export default async function Page({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const bookId = (await params).bookId;

  const book = await getBookByIdAction(bookId);

  if (!book.data) {
    return <div>Error</div>;
  }
  return <BookSummaryContainer book={book.data} />;
}
