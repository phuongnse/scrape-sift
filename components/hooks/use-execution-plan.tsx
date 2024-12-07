import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import {
  flowToExecutionPlan,
  FlowToExecutionPlanValidationError,
} from "@/lib/workflow/execution-plan";
import { AppNode } from "@/types/app-node";
import useFlowValidation from "@/components/hooks/use-flow-validation";
import { toast } from "sonner";

const useExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const { setInvalidInputs, clearErrors } = useFlowValidation();

  const handleError = useCallback(
    (error: any) => {
      switch (error.type) {
        case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
          toast.error("No entry point found");
          break;
        case FlowToExecutionPlanValidationError.INVALID_INPUTS:
          toast.error("Not all inputs values are set");
          setInvalidInputs(error.invalidElements);
          break;
        default:
          toast.error("Something went wrong");
          break;
      }
    },
    [setInvalidInputs],
  );

  return useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = flowToExecutionPlan(
      nodes as AppNode[],
      edges,
    );

    if (error) {
      handleError(error);
      return null;
    }

    clearErrors();
    return executionPlan;
  }, [toObject, flowToExecutionPlan, handleError, clearErrors]);
};

export default useExecutionPlan;
