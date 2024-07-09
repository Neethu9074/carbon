/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Progress, ResultPrecisionDetails, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { KubernetesQueryFilter } from 'in-kubernetes/subscriptions/exploreKubernetes';

export interface GetEtcdHostQuery {
  filter: KubernetesQueryFilter;
}

export interface EtcdHostInfo {
  data: any;
  time: number;
  adjustedWindowSize: number;
  resultPrecisionDetails: ResultPrecisionDetails;
  errors: Error[];
  progress: Progress;
  backendTraceId: string;
}

const getEtcdHosts = createResultSubscriptionFactory<GetEtcdHostQuery, Result<EtcdHostInfo>>({
  eventId: 'getEtcdHosts'
});

export default getEtcdHosts;
