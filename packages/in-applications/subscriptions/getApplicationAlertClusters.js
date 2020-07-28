import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getApplicationAlertClusters',
  trackSubscriptionStatistics: true
});
