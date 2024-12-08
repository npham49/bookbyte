import { connect } from "http2";
import { summarizeChapter } from "../libs/chapterSummarizing";
import { getFirstSplitBook, setStatus } from "../services/book.service";
import { getChaptersFromBookId } from "../services/chapter.service";
import { createSummaryChapter } from "../services/summary.service";

export const summarizeJob = async () => {
  console.log("Summarize Job");
  // Your code here
  const book = await getFirstSplitBook();
  if (!book) {
    console.info("No book needs summarizing found");
    return;
  }

  try {
    const chapters = await getChaptersFromBookId(book.id);

    if (!chapters || chapters.length === 0) {
      console.error("No chapters found for book");
      return;
    }

    await setStatus(book.id, "SUMMARIZING");
    const chapter = chapters[0];

    const summary = await summarizeChapter(chapter, book);

    await createSummaryChapter({
      shortForm: summary.shortform,
      longForm: summary.longform,
      title: summary.title,
      chapter: {
        connect: {
          id: chapter.id,
        },
      },
    });

    await setStatus(book.id, "READY");
  } catch (error) {
    console.error("Error summarizing", error);
    await setStatus(book.id, "ERROR");
  }
};
