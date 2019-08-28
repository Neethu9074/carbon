import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getTraces',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
