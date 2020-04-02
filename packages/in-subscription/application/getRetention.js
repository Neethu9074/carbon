import { get } from 'lodash';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getRetention = createResultSubscriptionFactory({
  eventId: 'getRetention',
  memoizeFor: 1000,
  trackSubscriptionStatistics: true
});
export default getRetention;

export function retention$(timeConfig, defaultValue) {
  return getRetention({ timeConfig: timeConfig })
    .map(result => get(result, ['data'], defaultValue))
    .distinct();
}
