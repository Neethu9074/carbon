import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getMobileAppPaginatedBeaconGroups',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
