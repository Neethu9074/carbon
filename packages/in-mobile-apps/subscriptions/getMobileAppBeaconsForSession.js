import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getMobileAppBeaconsForSession',
  disposeSubscriptionOnDocumentHidden: false,
  trackSubscriptionStatistics: true
});
