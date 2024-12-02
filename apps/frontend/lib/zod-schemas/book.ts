import { z } from "zod";

export const newBookSchema = z.object({
  name: z.string().min(1).max(255),
  author: z.string().min(1).max(255),
  category: z.array(z.string()),
  publication: z.coerce.number(),
  chapterSeparator: z.string(),
  publicDomain: z.boolean(),
  copyrightReferencesRemoved: z.boolean(),
});

export type NewBookSchema = z.infer<typeof newBookSchema>;
