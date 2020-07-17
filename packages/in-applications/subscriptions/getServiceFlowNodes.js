import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getServiceFlowNodes',
  memoizeFor: 100,
  trackSubscriptionStatistics: true
});
