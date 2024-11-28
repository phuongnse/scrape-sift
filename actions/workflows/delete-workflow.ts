"use server";

import { Workflow } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function deleteWorkflow(workflow: Workflow) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("unauthenticated");
  }

  await prisma.workflow.delete({
    where: {
      id: workflow.id,
      userId,
    },
  });

  revalidatePath("/workflows");
}
