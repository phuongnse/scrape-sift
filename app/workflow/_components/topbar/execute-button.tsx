"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";
import useExecutionPlan from "@/components/hooks/use-execution-plan";
import { useMutation } from "@tanstack/react-query";
import { runWorkflow } from "@/actions/workflows/run-workflow";
import { toast } from "sonner";
import { useReactFlow } from "@xyflow/react";

function ExecuteButton({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const { mutate, isPending } = useMutation({
    mutationFn: runWorkflow,
    onSuccess: () => {
      toast.dismiss("flow-execution");
    },
    onError: () => {
      toast.error("Something went wrong", { id: "flow-execution" });
    },
  });

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={isPending}
      onClick={() => {
        const plan = generate();

        // client side validation
        if (!plan) {
          return;
        }

        mutate({
          workflowId,
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
    >
      <PlayIcon size={16} className="stroke-orange-400" />
      Execute
    </Button>
  );
}

export default ExecuteButton;
