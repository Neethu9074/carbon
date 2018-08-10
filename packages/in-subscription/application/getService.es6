import { createResultSubscriptionFactory, isLiveSubscription } from 'in-subscription/resultSubscriptions';

export default function(data) {
  return createResultSubscriptionFactory({
    eventId: 'getService',
    memoizeFor: isLiveSubscription(data) ? 1000 * 10 : 1000 * 60 * 2
  })(data);
}
