/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { Result, LogItem } from 'in-types';
import { minutes } from 'in-services/time';

interface CreateResultSubscriptionFactoryRequest {}
interface CreateResultSubscriptionFactoryResponse extends Result<LogItem> {}

export default createResultSubscriptionFactory<
  CreateResultSubscriptionFactoryRequest,
  CreateResultSubscriptionFactoryResponse
>({
  eventId: 'logsV2.getLog',
  memoizeFor: minutes.toMillis(5)
});
