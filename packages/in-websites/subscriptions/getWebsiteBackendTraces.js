import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getEumBeaconBackendTraces',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
