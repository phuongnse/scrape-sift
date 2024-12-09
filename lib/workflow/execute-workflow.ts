import "server-only";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/app-node";
import { taskRegistry } from "@/lib/workflow/task/registry";
import { TaskType } from "@/types/task";
import { executorRegistry } from "@/lib/workflow/executor/registry";

export async function executeWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  const environment = { phases: {} };

  await initializeWorkflowExecution(executionId, execution.workflowId);
  await initializePhaseStatus(execution);

  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    // TODO: consume credits

    const phaseExecution = await executeWorkflowPhase(phase);
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    creditsConsumed,
    executionFailed,
  );

  // TODO: clean up environment

  revalidatePath("/workflows/run");
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string,
) {
  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });

  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
    },
  });
}

async function initializePhaseStatus(execution: any) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase: any) => phase.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  creditsConsumed: number,
  executionFailed: boolean,
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: {
      id: executionId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((_) => {
      // IGNORE
      // this means that we have triggered other runs for this workflow
      // while an execution was running
    });
}

async function executeWorkflowPhase(phase: ExecutionPhase) {
  const startedAt = new Date();

  await prisma.executionPhase.update({
    where: {
      id: phase.id,
    },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
    },
  });

  const node = JSON.parse(phase.node) as AppNode;
  const creditRequired = taskRegistry[node.data.type].credits;
  console.log(
    `Executing phase ${phase.name} with ${creditRequired} credits required`,
  );

  // TODO: decrement user balance (with required credits)

  const success = await executePhase(phase, node);
  await finalizePhase(phase.id, success);
  return { success };
}

async function finalizePhase(phaseId: string, success: boolean) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: {
      id: phaseId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
): Promise<boolean> {
  const runFn = executorRegistry[node.data.type];
  if (!runFn) {
    return false;
  }

  return await runFn();
}
