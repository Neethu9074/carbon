import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getMobileAppMetrics',
  trackSubscriptionStatistics: true
});
