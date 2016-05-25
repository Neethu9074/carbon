import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription(
  // event ID
  'subscribe-filterable-tags',

  // getID
  time => time,

  // data to be send for subscription
  (subscriptionId, time) => {
    return {
      subscriptionId,
      time
    };
  },

  // data transformation on onData
  filterableTags => {
    filterableTags.sort((a, b) => {
      return a.localeCompare(b, 'en-US', {
        sensitivity: 'base'
      });
    });
    return Immutable.List(filterableTags);
  }
);
