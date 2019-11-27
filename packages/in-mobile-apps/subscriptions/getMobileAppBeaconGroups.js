import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getMobileAppBeaconGroups',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
