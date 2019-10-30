import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'integrations.getReferences',
  trackSubscriptionStatistics: true
});
