"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";

type ChapterWithSummary = Prisma.ChapterGetPayload<{
  include: {
    summary: {
      select: { id: true; title: true; chapterId: true; updatedAt: true };
    };
  };
}>;

export function ChapterList({ chapters }: { chapters: ChapterWithSummary[] }) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const router = useRouter();

  const sortedChapters = [...chapters].sort((a, b) => {
    return sortOrder === "asc" ? a.number - b.number : b.number - a.number;
  });

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Chapters
        </h2>
        <Button variant="outline" onClick={toggleSortOrder}>
          Sort {sortOrder === "asc" ? "Descending" : "Ascending"}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Number</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="text-right">Last Updated</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedChapters.map((chapter) => (
            <TableRow
              onClick={() =>
                router.push(
                  `/read/${chapter.bookId}/chapters/${chapter.number}`
                )
              }
              className="cursor-pointer"
              key={chapter.id}
            >
              <TableCell className="font-medium">{chapter.number}</TableCell>
              <TableCell>{chapter.summary?.title}</TableCell>
              <TableCell className="text-right">
                {chapter.summary?.updatedAt.toDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
