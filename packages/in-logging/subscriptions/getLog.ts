/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, LogItem, LogQuery } from 'in-types';
import { minutes } from 'in-services/time';

interface GetLogResponse extends Result<LogItem> {}

export default createResultSubscriptionFactory<LogQuery, GetLogResponse>({
  eventId: 'logsV2.getLog',
  memoizeFor: minutes.toMillis(5)
});
