/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { TimeConfig } from '@instana/types';
import { Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetRelatedResourceForKubeCostRequest {}

interface GetRelatedResourceForKubeCostResponse extends Result<KubeCostEntity> {}

export interface KubeCostEntity {
  readonly id: string;
  readonly currencyCode: string;
}

const getRelatedResourcesForKubeCost = createResultSubscriptionFactory<
  GetRelatedResourceForKubeCostRequest,
  GetRelatedResourceForKubeCostResponse
>({
  eventId: 'getRelatedResourcesForKubeCost'
});

interface RelatedResourcesForKubeCostOptions {
  id: string;
  timeConfig: TimeConfig;
}

export default getRelatedResourcesForKubeCost;

export function getRelatedResourcesForKubeCostWithDefaults(options: RelatedResourcesForKubeCostOptions) {
  const { id = '', timeConfig } = options;
  return getRelatedResourcesForKubeCost({
    id,
    timeConfig
  });
}
