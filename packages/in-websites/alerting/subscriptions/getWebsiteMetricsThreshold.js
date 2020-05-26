import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getWebsiteMetricsThreshold',
  trackSubscriptionStatistics: true
});
