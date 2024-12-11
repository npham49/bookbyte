"use client";

import { useRef, useEffect, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChapterSummaryCard } from "./chapter-summary-card";
import { Chapter, Summary } from "@prisma/client";

interface SummaryItem {
  text: string;
  index: number;
  chapter: number;
}

export default function ChapterSummaryCarousel({
  summary,
  chapter,
}: {
  summary: Summary;
  chapter: Chapter;
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollTo({
        top: index * container.clientHeight,
        behavior: "smooth",
      });
    }
  };

  const handleScroll = (direction: "up" | "down") => {
    if (isScrolling) return;
    setIsScrolling(true);
    const newIndex =
      direction === "up"
        ? Math.max(0, activeIndex - 1)
        : Math.min(summary.shortForm.length - 1, activeIndex + 1);
    setActiveIndex(newIndex);
    scrollToIndex(newIndex);
    setTimeout(() => setIsScrolling(false), 500); // Debounce scrolling
  };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isScrolling) return;
      const direction = e.deltaY > 0 ? "down" : "up";
      handleScroll(direction);
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [isScrolling, activeIndex]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollTop / container.clientHeight);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeIndex]);

  return (
    <div className="h-screen w-full bg-black text-white overflow-hidden relative">
      <div
        ref={containerRef}
        className="h-full overflow-y-auto overflow-hidden snap-y snap-mandatory"
        style={{ scrollSnapType: "y mandatory" }}
      >
        <h1 className="text-xl font-bold text-center absolute top-16 left-0 right-0 z-10">
          {chapter.number} - {summary.title}
        </h1>
        {(summary.longForm as unknown as SummaryItem[]).map(
          (summary, index) => (
            <div key={index} className="h-full snap-start">
              <ChapterSummaryCard
                summary={summary.text}
                index={summary.index}
              />
            </div>
          )
        )}
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/10 text-white hover:bg-white/20"
          onClick={() => handleScroll("up")}
          disabled={activeIndex === 0}
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white/10 text-white hover:bg-white/20"
          onClick={() => handleScroll("down")}
          disabled={activeIndex === summary.shortForm.length - 1}
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
