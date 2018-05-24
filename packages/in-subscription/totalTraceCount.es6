import { fromJS } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-trace-count',

  transform(observable) {
    return observable.map(fromJS);
  }
});
