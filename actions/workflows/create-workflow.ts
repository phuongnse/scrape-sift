"use server";

import {
  createWorkflowSchema,
  CreateWorkflowSchemaType,
} from "@/schema/workflow";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { AppNode } from "@/types/app-node";
import { Edge } from "@xyflow/react";
import { createFlowNode } from "@/lib/workflow/create-flow-node";
import { TaskType } from "@/types/task";

export async function createWorkflow(form: CreateWorkflowSchemaType) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  const { success, data } = createWorkflowSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const initialFlow: {
    nodes: AppNode[];
    edges: Edge[];
  } = {
    // add the entry point
    nodes: [createFlowNode(TaskType.LAUNCH_BROWSER)],
    edges: [],
  };

  const result = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      definition: JSON.stringify(initialFlow),
      ...data,
    },
  });

  if (!result) {
    throw new Error("Failed to create workflow");
  }

  redirect(`/workflow/editor/${result.id}`);
}
