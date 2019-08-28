import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getEndpointInfo',
  memoizeFor: 100,
  trackSubscriptionStatistics: true
});
