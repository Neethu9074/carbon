import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-latest-metrics',
  memoizeFor: 1000
});
