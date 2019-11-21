import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getProfiles',
  disposeSubscriptionOnDocumentHidden: false
});
