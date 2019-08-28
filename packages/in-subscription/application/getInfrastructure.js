import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getInfrastructure',
  trackSubscriptionStatistics: true
});
