import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getApplicationEntityHealthInfo',
  trackSubscriptionStatistics: true
});
