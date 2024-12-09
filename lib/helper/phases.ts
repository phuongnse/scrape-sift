import { ExecutionPhase } from "@prisma/client";

type Phase = Pick<ExecutionPhase, "creditsConsumed">;

export function getPhasesTotalCost(phases: Phase[]) {
  return phases.reduce(
    (accumulate, phase) => accumulate + (phase.creditsConsumed || 0),
    0,
  );
}
