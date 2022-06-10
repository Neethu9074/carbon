/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { GetLogMessagesQuery, LogMessageItem, PaginatedResult, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<GetLogMessagesQuery, Result<PaginatedResult<LogMessageItem>>>({
  eventId: 'getLogMessages',
  trackSubscriptionStatistics: true
});
