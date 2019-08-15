import { isAdhocMetricAggregationEnabled } from 'in-services/featureFlags';
import createSubscription from 'in-subscription/subscription';

const eventId = isAdhocMetricAggregationEnabled
  ? 'subscribe-historic-metric-single-v2'
  : 'subscribe-historic-metric-single';

export default createSubscription({
  eventId,
  memoizeFor: 100
});
