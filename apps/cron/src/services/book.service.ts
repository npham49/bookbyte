import { BookStatus } from "@prisma/client";
import { prisma } from "../../prisma/db";

export const getFirstUploadedBook = async () => {
  const response = await prisma.book.findFirst({
    orderBy: {
      createdAt: "asc",
    },
    where: {
      status: "UPLOADED",
    },
  });
  return response;
};

export const setStatus = async (id: string, status: BookStatus) => {
  const response = await prisma.book.update({
    where: {
      id,
    },
    data: {
      status,
    },
  });
  return response;
};
