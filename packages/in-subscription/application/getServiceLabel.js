import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getServiceLabel',
  memoizeFor: 100,
  trackSubscriptionStatistics: true
});
