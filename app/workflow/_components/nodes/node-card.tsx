"use client";

import React, { ReactNode } from "react";
import { NodeProps, useReactFlow } from "@xyflow/react";
import { cn } from "@/lib/utils";

function NodeCard({
  children,
  props,
}: {
  children: ReactNode;
  props: NodeProps;
}) {
  const { getNode, setCenter } = useReactFlow();

  return (
    <div
      className={cn(
        "rounded-md cursor-pointer bg-background border-2 border-separate w-[420px] text-xs gap-1 flex flex-col",
        props.selected && "border-primary",
      )}
      onDoubleClick={() => {
        const node = getNode(props.id);

        if (!node) {
          return;
        }

        const { position, measured } = node;

        if (!measured) {
          return;
        }

        const { width, height } = measured;
        const { x, y } = position;
        const centerX = x + width! / 2;
        const centerY = y + height! / 2;

        if (centerX === undefined || centerY === undefined) {
          return;
        }

        setCenter(centerX, centerY, {
          zoom: 1,
          duration: 200,
        }).then();
      }}
    >
      {children}
    </div>
  );
}

export default NodeCard;
