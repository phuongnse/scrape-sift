"use client";

import React from "react";
import { taskRegistry } from "@/lib/workflow/task/registry";
import { Badge } from "@/components/ui/badge";
import { CoinsIcon, GripVerticalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskType } from "@/types/task";

function NodeHeader({ taskType }: { taskType: TaskType }) {
  const task = taskRegistry[taskType];

  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={16} />
      <div className="flex justify-between items-center w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {task.label}
        </p>
        <div className="flex gap-1 items-center">
          {task.isEntryPoint && <Badge>Entry point</Badge>}
          <Badge className="gap-2 flex items-center text-xs">
            <CoinsIcon size={16} />
            TODO
          </Badge>
          <Button
            variant="ghost"
            size="icon"
            className="drag-handle cursor-grab"
          >
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NodeHeader;
