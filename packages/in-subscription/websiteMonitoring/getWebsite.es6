import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getWebsite',
  disposeSubscriptionOnDocumentHidden: false
});
