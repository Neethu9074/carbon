import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getServiceMap',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
