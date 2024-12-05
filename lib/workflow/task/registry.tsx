import { launchBrowserTask } from "@/lib/workflow/task/launch-browser";
import { pageToHtmlTask } from "@/lib/workflow/task/page-to-html";
import { extractTextFromElementTask } from "@/lib/workflow/task/extract-text-from-element";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const taskRegistry: Registry = {
  LAUNCH_BROWSER: launchBrowserTask,
  PAGE_TO_HTML: pageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementTask,
};
