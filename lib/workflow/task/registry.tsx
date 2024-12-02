import { TaskType } from "@/types/task";
import { launchBrowserTask } from "@/lib/workflow/task/launch-browser";
import { pageToHtmlTask } from "@/lib/workflow/task/page-to-html";

export const taskRegistry = {
  [TaskType.LAUNCH_BROWSER]: launchBrowserTask,
  [TaskType.PAGE_TO_HTML]: pageToHtmlTask,
};
