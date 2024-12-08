import { Book, Chapter } from "@prisma/client";
import { Readable } from "stream";
import { TokenTextSplitter } from "@langchain/textsplitters";
import { PromptTemplate } from "@langchain/core/prompts";
import { loadSummarizationChain } from "langchain/chains";
import { JsonOutputParser } from "@langchain/core/output_parsers";
import { openaiModel } from "../openai";
import getS3Object from "../s3/get-file";
import { SummarizedChapter } from "../../interface/summarizedChapter.type";

export const summarizeChapter = async (chapter: Chapter, book: Book) => {
  const chapterFile = await getS3Object(chapter.fileKey);
  const readable = chapterFile.Body as Readable;

  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(chunk);
  }
  const chapterText = Buffer.concat(chunks).toString("utf-8");

  const splitter = new TokenTextSplitter({
    chunkSize: 10000,
    chunkOverlap: 250,
  });

  const splittedChapterText = await splitter.splitText(chapterText);

  const summaryTemplate = `
    You are an expert in summarizing books chapter.
    Your goal is to create a summary of a chapter a book.
    You will receive the text of a book chapter.
    the book is called ${book.name}, and the category is ${book.category.join(
    ","
  )}.
    Below you find the transcript of a book chapter:
    --------
    {text}
    --------

    You need to create 2 versions of the summary: a longform summary used for displaying on to the website and a shortform summary used for creating a video.
    MUST BE 3 objects in each array, MUST continue from the previous index.
    The output will be a JSON object with the following properties: 
    - chapter: the chapter number taken from the first line of the text
    - title: the title of the chapter, can be refined if needed
    - longform: an array of 3 json object with the following properties:
      - chapter: the chapter number
      - index: the position of the summary in the chapter
      - text: the text of the summary, MUST BE 300 words long
    - shortform: an array of 3 json objects with the following properties:
      - chapter: the chapter number
      - index: the position of the summary in the chapter
      - text: the text of the summary, MUST BE 150 words long
    `;

  const SUMMARY_PROMPT = PromptTemplate.fromTemplate(summaryTemplate);

  const summaryRefineTemplate = `
    You are an expert in summarizing books chapter.
    Your goal is to create a summary of a chapter a book.
    You will receive the text of a book chapter.
    the book is called ${book.name}, and the category is ${book.category.join(
    ","
  )}.
    We have provided an existing summary up to a certain point: {existing_answer}
    Below you find the transcript of a book chapter:
    --------
    {text}
    --------

    Given the new context, refine the summary and example questions.
    You need to create 2 versions of the summary: a longform summary used for displaying on to the website and a shortform summary used for creating a video.
    If the context isn't useful, return the original summary.
    Total output will be a cumulative of all content provided.
    Format the summary as sections as if the user is reading through the chapter instead of Opening, Middle, and End.
    MUST BE 3 objects in each array, MUST continue from the previous index.
    The output will be a JSON object with the following properties: 
    - chapter: the chapter number taken from the first line of the text, MUST BE KEPT THE SAME
    - title: the title of the chapter, can be refined if needed
    - longform: an array of 3 json object with the following properties:
      - chapter: the chapter number
      - index: the position of the summary in the chapter
      - text: the text of the summary, MUST BE 300 words long
    - shortform: an array of 3 json objects with the following properties:
      - chapter: the chapter number
      - index: the position of the summary in the chapter
      - text: the text of the summary, MUST BE 150 words long
    `;

  const SUMMARY_REFINE_PROMPT = PromptTemplate.fromTemplate(
    summaryRefineTemplate
  );

  const parser = new JsonOutputParser<SummarizedChapter>();

  const summarizeChain = loadSummarizationChain(openaiModel, {
    type: "refine",
    verbose: true,
    questionPrompt: SUMMARY_PROMPT,
    refinePrompt: SUMMARY_REFINE_PROMPT,
  }).pipe((output) => parser.invoke(output.output_text));

  const summary = await summarizeChain.invoke({
    input_documents: splittedChapterText,
  });

  return summary;
};
