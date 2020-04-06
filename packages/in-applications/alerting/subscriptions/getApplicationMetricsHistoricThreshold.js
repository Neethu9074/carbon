import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getApplicationMetricsHistoricThreshold',
  trackSubscriptionStatistics: true
});
