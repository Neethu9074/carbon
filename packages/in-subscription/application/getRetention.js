import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getRetention = createResultSubscriptionFactory({
  eventId: 'getRetention',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});
export default getRetention;

export function retention$(timeConfig, defaultValue = { containsHistoricData: false, retention: 7 }) {
  return getRetention({ timeConfig: timeConfig })
    .map(result => result?.data || defaultValue)
    .distinct();
}
