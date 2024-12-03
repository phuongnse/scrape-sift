"use client";

import React, { useCallback, useEffect, DragEvent } from "react";
import { Workflow } from "@prisma/client";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import NodeComponent from "@/app/workflow/_components/nodes/node-component";
import { createFlowNode } from "@/lib/workflow/create-flow-node";
import { TaskType } from "@/types/task";
import { AppNode } from "@/types/app-node";
import DeletableEdge from "@/app/workflow/_components/edges/deletable-edge";

const nodeTypes = {
  SiftScrapeNode: NodeComponent,
};

const edgeTypes = {
  default: DeletableEdge,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = { padding: 1 };

function FlowEditor({ workflow }: { workflow: Workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.definition);

      if (!flow) {
        return;
      }

      setNodes(flow.nodes || []);
      setEdges(flow.edges || []);

      if (!flow.viewport) {
        return;
      }

      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom }).then(() => {});
    } catch {}
  }, [workflow.definition, setNodes, setEdges, setViewport]);

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const taskType = event.dataTransfer.getData("application/reactflow");
      if (!taskType) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = createFlowNode(taskType as TaskType, position);
      setNodes((nodes) => nodes.concat(newNode));
    },
    [screenToFlowPosition, createFlowNode, setNodes],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((edges) => addEdge({ ...connection, animated: true }, edges));

      if (!connection.targetHandle) {
        return;
      }

      const node = nodes.find((node) => node.id === connection.target);

      if (!node) {
        return;
      }

      const nodeInputs = node.data.inputs;
      delete nodeInputs[connection.targetHandle];
      updateNodeData(node.id, { inputs: { ...nodeInputs } });
    },
    [setEdges, addEdge, nodes, updateNodeData],
  );

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        snapToGrid
        snapGrid={snapGrid}
        fitViewOptions={fitViewOptions}
        fitView
        onDragOver={onDragOver}
        onDrop={onDrop}
        onConnect={onConnect}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;
