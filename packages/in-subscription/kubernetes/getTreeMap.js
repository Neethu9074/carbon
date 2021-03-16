/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import { minutes, seconds } from 'in-services/time';

export default createResultSubscriptionFactory({
  eventId: 'getTreeMap',
  memoizeFor: args => {
    const timeConfig = args[0].filter.timeConfig;
    // since the treemap is completely based on the graph, historical data will probably not change
    if (!timeConfig.autoRefresh) {
      return Math.min(minutes.toMillis(5), timeConfig.windowSize);
    } else return seconds.toMillis(5);
  },
  disposeSubscriptionOnDocumentHidden: false
});
