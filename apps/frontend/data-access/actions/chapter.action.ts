"use server";

import { auth } from "@clerk/nextjs/server";
import {
  getChapterByNumberAndBookId,
  getChapterCountFromBook,
} from "../db/chapter.service";

export const getChapterCountFromBookAction = async (bookId: string) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const response = await getChapterCountFromBook(bookId);
  return {
    data: response,
  };
};

export const getChapterAndSummaryByNumberAndBookIdAction = async (
  bookId: string,
  number: number
) => {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const response = await getChapterByNumberAndBookId(bookId, number);
  return {
    data: response,
  };
};
