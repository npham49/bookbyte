import { Readable } from "stream";
import getS3Object from "../libs/s3/get-file";
import { getFirstUploadedBook, setStatus } from "../services/book.service";
import {
  getHeadings,
  getLines,
  ignoreTOC,
  splitIntoChapters,
} from "../libs/chapterSplitting";
import { uploadFileToS3 } from "../libs/s3/upload-file";
import { createChapter } from "../services/chapter.service";

/**
 * This job would get the first uploaded book from the database, split it into chapters, and save the chapters to the database.
 */
export async function getFirstBookAndSplit() {
  const book = await getFirstUploadedBook();
  if (!book) {
    console.info("No book needs splitting found");
    return;
  }

  console.info("Book found, splitting...");
  await setStatus(book.id, "SPLITTING");

  const bookFile = await getS3Object(book.fileKey);
  const readable = bookFile.Body as Readable;

  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(chunk);
  }
  const bookText = Buffer.concat(chunks).toString("utf-8");

  // console.log("Book text", bookText);

  // Split the book into chapters
  const lines = getLines(bookText);
  const headings = getHeadings(lines, book.chapterSeparator);

  const headingsAfterIgnore = ignoreTOC(headings);

  if (headings.length < 3) {
    console.error(
      "Fewer than three chapters detected. Chapter detection might be incorrect."
    );
    return;
  }
  console.log("Headings", headingsAfterIgnore);

  const chapters = splitIntoChapters(lines, headingsAfterIgnore);

  console.log("Chapters Length", chapters.length);
  // console.info("Chapters", chapters);

  // Save the chapters

  const chapterPromises = chapters.map(async (chapter, index) => {
    // console.log("Chapter", index, chapter);

    const fileName = await uploadFileToS3(
      Buffer.from(chapter),
      `${book.fileKey}/chapter-${index + 1}.txt`
    );

    await createChapter({
      fileKey: fileName,
      number: index + 1,
      book: {
        connect: {
          id: book.id,
        },
      },
    });

    console.log("Chapter uploaded", fileName);
  });

  Promise.all(chapterPromises)
    .then(async () => {
      console.log("All chapters uploaded");
      await setStatus(book.id, "SPLIT");
    })
    .catch((error) => {
      console.error("Error uploading chapters", error);
    });
}
