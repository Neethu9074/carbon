import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getTraceParticipants',
  trackSubscriptionStatistics: true
});
