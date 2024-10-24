/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ActionInstance, ApplicationBoundaryScope } from '@instana/types';

export type ActionListCalloutProps = {
  actionInstances: ActionInstance[];
  timestamp: number;
  count: number;
  boundaryScope: ApplicationBoundaryScope;
  labels: { applicationLabel: string; serviceLabel?: string; endpointLabel?: string };
  snapshotHostFqdn?: string;
  hasButtonInActionslane?: boolean;
};
