/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { GetKubernetesNodeByHostQuery, Progress, Result, ResultPrecisionDetails } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface HostProps {
  data: unknown[];
  time: number;
  adjustedWindowSize: any;
  resultPrecisionDetails: ResultPrecisionDetails;
  errors: Error[];
  progress: Progress;
  backendTraceId: string;
}

const getHostByKubernetesNode = createResultSubscriptionFactory<GetKubernetesNodeByHostQuery, Result<HostProps>>({
  eventId: 'getHostByKubernetesNode'
});

export default getHostByKubernetesNode;
