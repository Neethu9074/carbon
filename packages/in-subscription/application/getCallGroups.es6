import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';
import memoizeOnCases from 'in-subscription/subscriptionMemoization';

export default createResultSubscriptionFactory({
  eventId: 'getCallGroups',
  memoizeFor: memoizeOnCases(200, 1000 * 30, 1000 * 60 * 2)
});
