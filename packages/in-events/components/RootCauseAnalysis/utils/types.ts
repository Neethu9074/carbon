/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { EntityId } from '@instana/types';

export interface RootCause {
  snapshotId: string;
  probFailure: number;
  explainability: Explainability[];
  entityID: EntityId;
  prcIssueId: string;
  events: any[];
  timestamp: number;
}

export interface Explainability {
  percentageFailedNotThroughRC: number;
  numCallsInAggregationNotThroughRC: number;
  incoming: boolean;
  relevantSnapshotID: string;
  numCallsInAggregationThroughRC: number;
  connectedServiceId: string;
  percentageFailedThroughRC: number;
}
