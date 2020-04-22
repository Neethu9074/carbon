import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getSamplingLevel',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});
