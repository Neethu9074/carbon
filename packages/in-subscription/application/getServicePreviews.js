import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getServicePreviews',
  trackSubscriptionStatistics: true
});

// TODO move out of application
