/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, HasLogsResult, HasLogsQuery } from 'in-types';

interface HasLogsResponse extends Result<HasLogsResult> {}

export default createResultSubscriptionFactory<HasLogsQuery, HasLogsResponse>({
  eventId: 'logsV2.hasLogs'
});
