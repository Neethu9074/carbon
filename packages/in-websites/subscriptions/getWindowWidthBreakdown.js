import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getWindowWidthBreakdown',
  trackSubscriptionStatistics: true
});
