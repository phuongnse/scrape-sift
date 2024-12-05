import { FC } from "react";
import { LucideProps } from "lucide-react";
import { TaskParam, TaskType } from "@/types/task";

export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export type WorkflowTask = {
  label: string;
  icon: FC<LucideProps>;
  type: TaskType;
  isEntryPoint?: boolean;
  inputs: TaskParam[];
  outputs: TaskParam[];
  credits: number;
};
