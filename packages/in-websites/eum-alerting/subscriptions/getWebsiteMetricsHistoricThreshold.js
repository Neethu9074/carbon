import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getWebsiteMetricsHistoricThreshold',
  trackSubscriptionStatistics: true
});
