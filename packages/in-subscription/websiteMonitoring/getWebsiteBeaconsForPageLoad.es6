import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getWebsiteBeaconsForPageLoad',
  disposeSubscriptionOnDocumentHidden: false
});
