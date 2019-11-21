import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getApplicationServicesForCloudfoundryApplication',
  trackSubscriptionStatistics: true
});
