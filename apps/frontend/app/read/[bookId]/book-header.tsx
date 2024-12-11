"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { Book } from "@prisma/client";

export function BookHeader({ book }: { book: Book }) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <div className="flex-shrink-0">
          <Image
            src={"/placeholder.svg"}
            alt={book.name}
            width={200}
            height={300}
            className="rounded-lg shadow-md"
          />
        </div>
        <div className="flex flex-col justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {book.name}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-4">
              by {book.author}
            </p>
            <div className="flex flex-wrap gap-2 mb-4">
              {book.category.map((genre) => (
                <Badge key={genre} variant="secondary">
                  {genre}
                </Badge>
              ))}
            </div>
          </div>
          <Button className="w-full md:w-auto">
            <BookOpen className="mr-2 h-4 w-4" /> Start Reading
          </Button>
        </div>
      </div>
    </div>
  );
}
