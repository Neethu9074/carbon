import createSubscription from 'in-services/subscription/subscription';
import Immutable from 'immutable';


export default createSubscription.bind(null,
  // event ID
  'subscribe-filterable-tags',

  // getID
  () => '',

  // data to be send for subscription
  (subscriptionId) => {
    return {
      subscriptionId
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
