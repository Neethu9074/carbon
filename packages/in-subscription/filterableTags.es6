import { List } from 'immutable';

import createSubscription from 'in-subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-filterable-tags',

  getData(subscriptionId, timeConfig) {
    return {
      subscriptionId,
      timeConfig
    };
  },

  transform(observable) {
    return observable.map(filterableTags => {
      filterableTags.sort((a, b) => {
        return a.localeCompare(b, 'en-US', {
          sensitivity: 'base'
        });
      });
      return List(filterableTags);
    });
  }
});
