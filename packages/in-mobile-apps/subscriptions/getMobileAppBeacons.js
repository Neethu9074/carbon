import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getMobileAppBeacons',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
