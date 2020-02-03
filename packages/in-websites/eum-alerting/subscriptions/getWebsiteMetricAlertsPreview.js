import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getWebsiteMetricAlertsPreview',
  trackSubscriptionStatistics: true
});
