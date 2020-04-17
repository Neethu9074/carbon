import { fromJS } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'getMonitoringIssuesForAgentSnapshot',

  transform(observable) {
    return observable.map(fromJS);
  }
});
