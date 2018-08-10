import { createResultSubscriptionFactory, isLiveSubscription } from 'in-subscription/resultSubscriptions';

export default function(data) {
  return createResultSubscriptionFactory({
    eventId: 'getCalls',
    memoizeFor: isLiveSubscription(data) ? 100 : 2000
  })(data);
}
