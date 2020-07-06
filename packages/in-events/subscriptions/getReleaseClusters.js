import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getReleaseClusters',
  disposeSubscriptionOnDocumentHidden: false
});
