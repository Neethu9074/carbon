/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import type { Result, TimeConfig } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface GetSloQueryTimeWindowOverlapRequestPayload {
  sloConfigId: string;
  timeConfig: TimeConfig;
}

interface GetSloQueryTimeWindowOverlapResponse extends Result<TimeConfig[]> {}

export default createResultSubscriptionFactory<
  GetSloQueryTimeWindowOverlapRequestPayload,
  GetSloQueryTimeWindowOverlapResponse
>({
  eventId: 'getSLOQueryTimeWindowOverlapInfo',
  trackSubscriptionStatistics: true
});
