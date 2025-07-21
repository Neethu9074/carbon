/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Result, HasLogsResult, HasLogsQuery } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface HasLogsResponse extends Result<HasLogsResult> {}

export default createResultSubscriptionFactory<HasLogsQuery, HasLogsResponse>({
  eventId: 'logs.hasLogs'
});
