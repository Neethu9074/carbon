import createSubscription from 'in-services/subscription/subscription';
import Immutable from 'immutable';


export default createSubscription.bind(null,
  // event ID
  'subscribe-filters',

  // getID
  () => '',

  // data to be send for subscription
  (subscriptionId) => {
    return {
      subscriptionId
    };
  },

  // data transformation on onData
  filters => Immutable.fromJS(filters)
);
