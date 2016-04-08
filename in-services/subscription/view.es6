import createSubscription from 'in-services/subscription/subscription';
import Immutable from 'immutable';


export default createSubscription.bind(null,
  // event ID
  'subscribe-view',

  // getID
  ({viewType}) => viewType,

  // data to be send for subscription
  (subscriptionId, {viewType}) => {
    return {
      subscriptionId,
      viewType
    };
  },

  // data transformation on onData
  data => Immutable.fromJS(data)
);
