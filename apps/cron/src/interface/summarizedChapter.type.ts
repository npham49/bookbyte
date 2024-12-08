export interface SummarizedChapter {
  chapter: number;
  title: string;
  longform: {
    chapter: number;
    index: number;
    text: string;
  }[];
  shortform: {
    chapter: number;
    index: number;
    text: string;
  }[];
}
