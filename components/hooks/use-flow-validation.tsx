import { flowValidationContext } from "@/components/context/flow-validation-context";
import { useContext } from "react";

export default function useFlowValidation() {
  const context = useContext(flowValidationContext);
  if (!context) {
    throw new Error(
      "useFlowValidation must be used within a flow validation context.",
    );
  }

  return context;
}
