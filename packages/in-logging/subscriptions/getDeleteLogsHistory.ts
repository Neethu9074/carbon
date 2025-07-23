/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DeleteLogsHistoryResult, Result } from '@instana/types';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

interface LogHistoryResponse extends Result<DeleteLogsHistoryResult> {}

export default createResultSubscriptionFactory<null, LogHistoryResponse>({
  eventId: 'logs.v1.deleteLogsHistory',
  memoizeFor: 0
});
