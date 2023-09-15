/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { DeleteLogsHistoryResult } from '@instana/types/typeDefinitions';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result } from 'in-types';

interface LogHistoryResponse extends Result<DeleteLogsHistoryResult> {}

export default createResultSubscriptionFactory<null, LogHistoryResponse>({
  eventId: 'logs.v1.deleteLogsHistory',
  memoizeFor: 0
});
