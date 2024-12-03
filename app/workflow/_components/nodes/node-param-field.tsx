"use client";

import React, { useCallback } from "react";
import { TaskParam, TaskParamType } from "@/types/task";
import StringParam from "@/app/workflow/_components/nodes/param/string-param";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/app-node";
import BrowserInstanceParam from "@/app/workflow/_components/nodes/param/browser-instance-param";

interface Props {
  param: TaskParam;
  nodeId: string;
}

function NodeParamField({ param, nodeId }: Props) {
  const { updateNodeData, getNode } = useReactFlow();
  const node = getNode(nodeId) as AppNode;
  const value = node?.data.inputs[param.name];

  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node?.data.inputs,
          [param.name]: newValue,
        },
      });
    },
    [updateNodeData, nodeId, node?.data.inputs, param.name],
  );

  switch (param.type) {
    case TaskParamType.STRING:
      return (
        <StringParam
          param={param}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
        />
      );
    case TaskParamType.BROWSER_INSTANCE:
      return (
        <BrowserInstanceParam
          param={param}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
        />
      );
    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not implemented</p>
        </div>
      );
  }
}

export default NodeParamField;