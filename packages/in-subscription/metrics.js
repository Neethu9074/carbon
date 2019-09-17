import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-metrics',
  memoizeFor: 1000
});
