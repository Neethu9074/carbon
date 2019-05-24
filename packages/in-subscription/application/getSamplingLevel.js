import { get } from 'lodash';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const getSamplingLevel = createResultSubscriptionFactory({
  eventId: 'getSamplingLevel',
  memoizeFor: 1000
});

export default getSamplingLevel;

export function getSamplingLevel$(timeConfig) {
  return getSamplingLevel({ timeConfig: timeConfig })
    .map(result => get(result, ['data']))
    .distinct();
}
