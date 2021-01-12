import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

export default createResultSubscriptionFactory({
  eventId: 'getEndpointsCursorPaginated',
  trackSubscriptionStatistics: true
});
