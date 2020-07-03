import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getLatencyDistributionBase10',
  memoizeFor: 5000,
  trackSubscriptionStatistics: true
});
