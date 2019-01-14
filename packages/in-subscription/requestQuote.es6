import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'requestQuote',
  disposeSubscriptionOnDocumentHidden: false,
  memoizeFor: 0
});
