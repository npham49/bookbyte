import { Card, CardContent } from "@/components/ui/card";

export function ChapterSummaryCard({
  index,
  summary,
}: {
  index: number;
  summary: string;
}) {
  return (
    <Card className="h-full w-full bg-gradient-to-b from-gray-900 to-black text-white border-none rounded-none flex flex-col justify-center">
      <CardContent className="text-lg md:text-base max-w-2xl mx-auto">
        <p>
          {index}. {summary}
        </p>
      </CardContent>
    </Card>
  );
}
