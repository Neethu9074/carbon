import { Map } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-connected-entities',

  transform(observable) {
    return observable.map(Map);
  }
});
