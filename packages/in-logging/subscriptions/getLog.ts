/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Result, LogItem, LogQuery } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { minutes } from 'in-services/time';

interface GetLogResponse extends Result<LogItem> {}

export default createResultSubscriptionFactory<LogQuery, GetLogResponse>({
  eventId: 'logs.getLog',
  memoizeFor: minutes.toMillis(5)
});
