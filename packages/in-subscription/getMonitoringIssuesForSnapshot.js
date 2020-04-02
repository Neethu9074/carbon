import { fromJS } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'getMonitoringIssuesForSnapshot',

  transform(observable) {
    return observable.map(fromJS);
  }
});
