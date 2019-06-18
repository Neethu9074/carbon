import createSubscription from 'in-subscription/subscription';
import { isAdhocMetricAggregationEnabled } from 'in-services/featureFlags';

const eventId = isAdhocMetricAggregationEnabled ? 'subscribe-live-metrics-v2' : 'subscribe-live-metric';

export default createSubscription({
  eventId,

  transform(observable) {
    return observable.map(dataPoint => {
      dataPoint.time = dataPoint[0];
      return dataPoint;
    });
  },

  memoizeFor: 1000
});
