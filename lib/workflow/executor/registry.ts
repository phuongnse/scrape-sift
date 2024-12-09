import { TaskType } from "@/types/task";
import { launchBrowserExecutor } from "@/lib/workflow/executor/lauch-browser-executor";

export const executorRegistry = {
  [TaskType.LAUNCH_BROWSER]: launchBrowserExecutor,
  [TaskType.PAGE_TO_HTML]: () => Promise.resolve(true),
  [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: () => Promise.resolve(true),
};
