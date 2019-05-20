import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getWebsitePaginatedBeaconGroups',
  disposeSubscriptionOnDocumentHidden: false
});
