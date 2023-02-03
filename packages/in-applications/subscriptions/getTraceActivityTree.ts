/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result, GetTraceActivityTreeQuery, TraceActivityTreeNode } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetTraceActivityTreeQuery, Result<TraceActivityTreeNode>>({
  eventId: 'getTraceActivityTree',
  trackSubscriptionStatistics: true
});

// TODO move to analyze
