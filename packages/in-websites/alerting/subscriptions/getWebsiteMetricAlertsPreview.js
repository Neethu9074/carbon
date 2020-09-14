import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getWebsiteMetricAlertsPreview',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});
