/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

interface AgentSnapshot {
  snapshotId?: string;
  plugin?: string;
  from?: number | null | undefined;
  to?: number | null | undefined;
  tags?: string[] | null | undefined;
  label?: string;
  host?: string;
}

export interface AgentSnapshotResponse {
  items?: AgentSnapshot[];
}
