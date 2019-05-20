import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'getInstanaVersion',
  memoizeFor: 24 * 60 * 60 * 1000 /* do not close this subscription */
});
