import { isAdhocMetricAggregationEnabled } from 'in-services/featureFlags';
import createSubscription from 'in-subscription/subscription';

const eventId = isAdhocMetricAggregationEnabled ? 'subscribe-historic-metrics-v2' : 'subscribe-historic-metric';

export default createSubscription({
  eventId,

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
