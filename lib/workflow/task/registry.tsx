import { TaskType } from "@/types/task";
import { launchBrowserTask } from "@/lib/workflow/task/launch-browser";

export const taskRegistry = {
  [TaskType.LAUNCH_BROWSER]: launchBrowserTask,
};
