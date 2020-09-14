import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getApplicationMetricsAlertPreview',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});
