import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getWebsiteBackendTraceId',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
