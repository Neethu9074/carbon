import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getCallGroups',
  disposeSubscriptionOnDocumentHidden: false
});
