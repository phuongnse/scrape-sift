import { TaskType } from "@/types/task";
import { AppNode } from "@/types/app-node";

export function createFlowNode(
  nodeType: TaskType,
  position?: { x: number; y: number },
): AppNode {
  return {
    id: crypto.randomUUID(),
    type: "SiftScrapeNode",
    dragHandle: ".drag-handle",
    position: position ?? { x: 0, y: 0 },
    data: {
      type: nodeType,
      inputs: {},
    },
  };
}
