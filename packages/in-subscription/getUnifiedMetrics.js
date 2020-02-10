import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getUnifiedMetrics',
  trackSubscriptionStatistics: true
});
