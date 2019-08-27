import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getCalls',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
