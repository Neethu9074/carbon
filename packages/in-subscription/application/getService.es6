import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import memoizeOnCases from 'in-subscription/subscriptionMemoization';

export default createResultSubscriptionFactory({
  eventId: 'getService',
  memoizeFor: memoizeOnCases()
});
