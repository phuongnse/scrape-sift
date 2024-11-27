"use server";

import prisma from "@/lib/prisma";
import { Workflow } from "@prisma/client";

export async function getWorkflowsForUser(
  userId?: string | null,
): Promise<Workflow[]> {
  if (!userId) {
    throw new Error("unauthenticated");
  }

  return prisma.workflow.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
