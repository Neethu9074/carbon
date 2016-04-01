import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription.bind(null,
  // event ID
  'subscribe-view',

  // getID
  ({viewType, time}) => viewType + time,

  // data to be send for subscription
  (subscriptionId, {viewType, time}) => {
    return {
      subscriptionId,
      viewType,
      time
    };
  },

  // data transformation on onData
  data => Immutable.fromJS(data)
);
