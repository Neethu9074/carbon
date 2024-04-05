/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetWindowWidthBreakdownQuery, Result, WindowWidthBreakdown } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetWindowWidthBreakdownQuery, Result<WindowWidthBreakdown[]>>({
  eventId: 'getWindowWidthBreakdown',
  trackSubscriptionStatistics: true
});
