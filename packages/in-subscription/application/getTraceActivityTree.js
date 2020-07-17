import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getTraceActivityTree',
  trackSubscriptionStatistics: true
});

// TODO move to analyze
