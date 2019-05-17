import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-historic-metric',

  transform(observable) {
    return observable.map(dataPoints => {
      for (let i = 0, len = dataPoints.length; i < len; i++) {
        dataPoints[i].time = dataPoints[i][0];
      }
      return dataPoints;
    });
  },

  memoizeFor: 100
});
