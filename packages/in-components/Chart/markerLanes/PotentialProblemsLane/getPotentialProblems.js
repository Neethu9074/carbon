import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getPotentialProblems',
  disposeSubscriptionOnDocumentHidden: false
});
