import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getLatencyHeatMapOverTime',
  memoizeFor: 5000
});
