/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetTraceSummaryQuery, Result, TraceSummary } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetTraceSummaryQuery, Result<TraceSummary>>({
  eventId: 'getTraceSummary',
  trackSubscriptionStatistics: true
});
