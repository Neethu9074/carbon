import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-live-metric',

  transform(observable) {
    return observable.map(dataPoint => {
      dataPoint.time = dataPoint[0];
      return dataPoint;
    });
  },

  memoizeFor: 1000
});
