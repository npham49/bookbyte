"use client";
import { Book } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export function BookCard({ book }: { book: Book }) {
  return (
    <Link href={`/read/${book.id}`}>
      <div className="group relative w-full sm:w-40 md:w-32 lg:w-36 xl:w-32 transition-transform duration-300 ease-in-out hover:-translate-y-2">
        <div className="relative h-72 sm:h-60 md:h-48 lg:h-54 xl:h-48 w-full sm:w-40 md:w-32 lg:w-36 xl:w-32 overflow-hidden rounded-lg shadow-lg">
          <Image
            src={"/placeholder.svg"}
            alt={book.name}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 ease-in-out group-hover:scale-110"
          />
        </div>
        <div className="mt-2 text-center">
          <h3 className="text-sm font-semibold line-clamp-2">{book.name}</h3>
          <p className="text-xs text-gray-600">{book.author}</p>
        </div>
      </div>
    </Link>
  );
}
