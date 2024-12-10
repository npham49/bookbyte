import prisma from "@/lib/db";

export const getChapterByNumberAndBookId = async (
  bookId: string,
  number: number
) => {
  const response = await prisma.chapter.findFirst({
    where: { bookId, number },
    include: { summary: true },
  });
  return response;
};

export const getChapterCountFromBook = async (bookId: string) => {
  const response = await prisma.chapter.count({
    where: { bookId },
  });
  return response;
};
