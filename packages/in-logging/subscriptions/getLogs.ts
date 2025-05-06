/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { LogsQuery, LogsResult, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory<LogsQuery, Result<LogsResult>>({
  eventId: 'logs.getLogs',
  memoizeFor: 0
});
