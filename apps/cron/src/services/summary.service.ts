import { Prisma } from "@prisma/client";
import { prisma } from "../../prisma/db";

export const createSummaryChapter = async (data: Prisma.SummaryCreateInput) => {
  return await prisma.summary.create({
    data,
  });
};
