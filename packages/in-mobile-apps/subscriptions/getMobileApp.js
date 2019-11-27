import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getMobileApp',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
