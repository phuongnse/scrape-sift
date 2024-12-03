import { launchBrowserTask } from "@/lib/workflow/task/launch-browser";
import { pageToHtmlTask } from "@/lib/workflow/task/page-to-html";
import { extractTextFromElementTask } from "@/lib/workflow/task/extract-text-from-element";

export const taskRegistry = {
  LAUNCH_BROWSER: launchBrowserTask,
  PAGE_TO_HTML: pageToHtmlTask,
  EXTRACT_TEXT_FROM_ELEMENT: extractTextFromElementTask,
};
