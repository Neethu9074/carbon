import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getWebsiteRateMetricHistoricThreshold',
  trackSubscriptionStatistics: true
});
