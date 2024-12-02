// Regular expressions for chapter headings
const arabicNumerals = "\\d+";
const romanNumerals =
  "(?=[MDCLXVI])M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})";
const numberWordsByTens = [
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];
const numberWords = [
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
].concat(numberWordsByTens);
const numberWordsPat = "(" + numberWords.join("|") + ")";
const ordinalNumberWords = [
  "first",
  "second",
  "third",
  "fourth",
  "fifth",
  "sixth",
  "seventh",
  "eighth",
  "ninth",
  "twelfth",
  "last",
]
  .concat(numberWords.map((word) => word + "th"))
  .concat(["twentieth", "thirtieth", "fortieth"]);
const ordinalsPat = "(the )?(" + ordinalNumberWords.join("|") + ")";
const enumeratorsList = [
  arabicNumerals,
  romanNumerals,
  numberWordsPat,
  ordinalsPat,
];
const enumerators = "(" + enumeratorsList.join("|") + ")";

// Helper to split book into lines and remove empty lines or lines with only whitespace or /r
export function getLines(contents: string) {
  return contents
    .split("\n")
    .filter((line) => line.trim().length > 0 && line.trim() !== "\r");
}

function isLikelyFootnote(lines: string[], index: number) {
  // Check the line context for footnote-like patterns
  const prevLine = lines[index - 1]?.trim() || "";
  const nextLine = lines[index + 1]?.trim() || "";

  const footnotePatterns = [
    /^[\*†]+$/, // Matches asterisks or dagger symbols
    /^\d+$/, // Matches isolated numbers
    /^[a-z]{1,3}\)$/, // Matches lowercase letters with closing parentheses (e.g., "a)")
  ];

  // Check if previous or next lines resemble footnotes
  return footnotePatterns.some(
    (pattern) => pattern.test(prevLine) || pattern.test(nextLine)
  );
}

// Helper to detect chapter headings
export function getHeadings(lines: string[], chapterDesignate?: string) {
  if (!chapterDesignate) {
    chapterDesignate = "chapter";
  }
  console.log("Chapter designate:", chapterDesignate);
  const form1 = new RegExp(
    `(?:${chapterDesignate}) ${enumerators}`,
    "i"
  ).source.replace(/^\(\?:(.+?)\) /i, `($1) `);
  const pattern = new RegExp(form1);
  const headings: number[] = [];
  lines.forEach((line, index) => {
    if (pattern.test(line) && !isLikelyFootnote(lines, index)) {
      headings.push(index);
    }
  });
  return headings;
}

// Helper to split text into chapters
export function splitIntoChapters(lines: string[], headings: number[]) {
  const chapters: string[] = [];
  headings.forEach((start, i) => {
    const end = headings[i + 1] || lines.length;
    chapters.push(lines.slice(start, end).join("\n"));
  });
  return chapters;
}

export function ignoreTOC(headingLocations: number[]) {
  /**
   * Filters out headings that are too close together,
   * assuming they belong to a table of contents.
   */
  const pairs = headingLocations
    .map((_, index, array) => {
      if (index < array.length - 1) {
        return [array[index], array[index + 1]];
      }
      return null;
    })
    .filter((pair) => pair); // Remove null values for the last element

  const toBeDeleted = new Set();
  pairs.forEach((pair) => {
    if (pair) {
      const [first, second] = pair;
      const delta = second - first;
      if (delta < 4) {
        toBeDeleted.add(first);
        toBeDeleted.add(second);
      }
    }
  });

  console.debug("TOC locations to be deleted:", Array.from(toBeDeleted));

  // Filter out bad locations from headingLocations
  return headingLocations.filter((location) => !toBeDeleted.has(location));
}
