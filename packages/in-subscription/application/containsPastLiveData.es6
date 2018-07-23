import { get } from 'lodash';

import { createResultSubscriptionFactory } from 'in-subscription/resultSubscriptions';

const containsPastLiveData = createResultSubscriptionFactory({
  eventId: 'containsPastLiveData'
});
export default containsPastLiveData;

export function containsPastLiveData$(timeConfig, defaultValue) {
  return containsPastLiveData({ timeConfig: timeConfig })
    .map(result => get(result, ['data'], defaultValue))
    .distinct();
}
