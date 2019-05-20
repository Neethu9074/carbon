import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-snapshot-versions-in-timeframe',
  memoizeFor: 1000
});
