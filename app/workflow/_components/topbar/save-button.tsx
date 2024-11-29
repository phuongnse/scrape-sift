"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { useReactFlow } from "@xyflow/react";
import { useMutation } from "@tanstack/react-query";
import { updateWorkflow } from "@/actions/workflows/update-workflow";
import { toast } from "sonner";

function SaveButton({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();

  const { mutate, isPending } = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: () => {
      toast.dismiss("save-workflow");
    },
    onError: () => {
      toast.error("Something went wrong", { id: "save-workflow" });
    },
  });

  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      disabled={isPending}
      onClick={() => {
        toast.loading("Saving workflow...", { id: "save-workflow" });
        const workflowDefinition = JSON.stringify(toObject());
        mutate({
          id: workflowId,
          definition: workflowDefinition,
        });
      }}
    >
      <CheckIcon size={16} className="stroke-green-400" />
      Save
    </Button>
  );
}

export default SaveButton;
