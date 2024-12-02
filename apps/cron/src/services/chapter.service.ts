import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/db";

export const createChapter = async (chapter: Prisma.ChapterCreateInput) => {
  return await prisma.chapter.create({
    data: chapter,
  });
};
