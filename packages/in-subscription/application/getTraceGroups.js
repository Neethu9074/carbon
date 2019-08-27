import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getTraceGroups',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
