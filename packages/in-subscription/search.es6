import { List } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-search',

  transform(observable) {
    return observable.map(List);
  }
});
