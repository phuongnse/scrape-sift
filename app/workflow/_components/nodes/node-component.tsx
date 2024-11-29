import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "@/app/workflow/_components/nodes/node-card";
import NodeHeader from "@/app/workflow/_components/nodes/node-header";
import { AppNodeData } from "@/types/app-node";
import { taskRegistry } from "@/lib/workflow/task/registry";
import {
  NodeInput,
  NodeInputs,
} from "@/app/workflow/_components/nodes/node-inputs";

const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  const taskType = nodeData.type;
  const task = taskRegistry[taskType];

  return (
    <NodeCard props={{ ...props }}>
      <NodeHeader taskType={taskType}></NodeHeader>
      <NodeInputs>
        {task.inputs.map((input) => (
          <NodeInput key={input.name} input={input} nodeId={props.id} />
        ))}
      </NodeInputs>
    </NodeCard>
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
