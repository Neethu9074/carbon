/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { minutes } from 'in-services/time';

export default createResultSubscriptionFactory({
  eventId: 'logsV2.getLog',
  memoizeFor: minutes.toMillis(5)
});
