/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

type AgentStatus = Record<number, string>;
export const StatusMap: AgentStatus = {
  0: 'Started',
  1: 'Stopped',
  2: 'Unknown',
  3: 'Active',
  4: 'Ready',
  5: 'Starting',
  6: 'Ended Unexpectedly',
  7: 'No Info',
  8: 'Problem',
  9: 'Deleted'
};

export function getAgentStatus(v: number) {
  return StatusMap[v];
}
