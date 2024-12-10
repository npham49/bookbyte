"use server";

import { uploadFileToS3 } from "@/lib/s3/upload-file";
import { newBookSchema } from "@/lib/zod-schemas/book";
import { auth } from "@clerk/nextjs/server";
import { createNewBook, getAllBooks, getBookById } from "../db/book.service";
import { revalidatePath } from "next/cache";
import { deleteFileS3 } from "@/lib/s3/delete-file";

export const addNewBook = async (formData: FormData) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  if (!formData.has("file")) {
    throw new Error("File is required");
  }

  const bookData = newBookSchema.safeParse(
    JSON.parse(formData.get("bookData") as string)
  );

  if (!bookData.success || !bookData.data) {
    console.log(bookData.error);
    throw new Error("Invalid book data");
  }

  const file = formData.get("file") as File;
  const fileBuffer = await file.arrayBuffer();
  const fileName = await uploadFileToS3(
    Buffer.from(fileBuffer),
    `${Date.now()}-${file.name}`
  );

  console.log(bookData.data);

  const response = await createNewBook({
    ...bookData.data,
    fileKey: fileName,
  }).catch(async (error) => {
    console.error(error);
    await deleteFileS3(fileName);
    throw new Error("Failed to add book");
  });

  console.log(fileName, bookData.data);
  revalidatePath("/admin/book-list");
  return {
    data: {
      response,
    },
  };
};

export const getAllBooksAction = async () => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const response = await getAllBooks();
  return {
    data: response,
  };
};

export const getBookByIdAction = async (id: string) => {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Unauthorized");
  }
  const response = await getBookById(id);
  return {
    data: response,
  };
};
