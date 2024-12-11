"use client";

import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

export function ChapterSummaryCard({
  index,
  summary,
}: {
  index: number;
  summary: string;
}) {
  const summaryText = `${index}. ${summary}`;
  return (
    <Card className="h-full w-full bg-gradient-to-b dark:from-gray-900 dark:to-black border-none rounded-none flex flex-col justify-center">
      <CardContent className="text-lg md:text-base max-w-2xl mx-auto">
        <ReactMarkdown className="prose dark:prose-invert prose-sm md:prose-base">
          {summaryText}
        </ReactMarkdown>
      </CardContent>
    </Card>
  );
}
