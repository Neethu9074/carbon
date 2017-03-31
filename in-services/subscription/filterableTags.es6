import { List } from 'immutable';

import createSubscription from 'in-services/subscription/subscription';

export default createSubscription({
  eventId: 'subscribe-filterable-tags',

  getId: time => time,

  getData: (subscriptionId, time) => {
    return {
      subscriptionId,
      time
    };
  },

  transformData: filterableTags => {
    filterableTags.sort((a, b) => {
      return a.localeCompare(b, 'en-US', {
        sensitivity: 'base'
      });
    });
    return List(filterableTags);
  }
});
