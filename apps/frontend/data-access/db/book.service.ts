import prisma from "@/lib/db";
import { BookStatus, Prisma } from "@prisma/client";

type BookCreateBody = Prisma.Args<typeof prisma.book, "create">["data"];

export const createNewBook = async (book: BookCreateBody) => {
  console.log(book);
  const response = await prisma.book.create({
    data: book,
  });
  return response;
};

export const getAllBooks = async () => {
  const response = await prisma.book.findMany();
  return response;
};

export const getBookById = async (id: string) => {
  const response = await prisma.book.findFirst({
    where: { id },
  });
  return response;
};

export const setBookStatus = async (id: string, status: BookStatus) => {
  const response = await prisma.book.update({
    where: { id },
    data: { status },
  });
  return response;
};
