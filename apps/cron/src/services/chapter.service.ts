import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/db";

export const createChapter = async (chapter: Prisma.ChapterCreateInput) => {
  return await prisma.chapter.create({
    data: chapter,
  });
};

export const getChaptersFromBookId = async (bookId: string) => {
  return await prisma.chapter.findMany({
    where: {
      bookId,
    },
  });
};
