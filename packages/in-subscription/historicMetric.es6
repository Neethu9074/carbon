import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-historic-metric-single',

  memoizeFor: 100
});
