import React from "react";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import Editor from "@/app/workflow/_components/editor";

async function Page({ params }: { params: { workflowId: string } }) {
  const { userId } = auth();

  if (!userId) {
    return <div>unauthenticated</div>;
  }

  const { workflowId } = params;

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  return <Editor workflow={workflow} />;
}

export default Page;
