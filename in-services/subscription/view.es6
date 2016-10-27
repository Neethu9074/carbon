import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';


export default createSubscription({
  eventId: 'subscribe-view',

  getId: ({viewType, time}) => viewType + time,

  getData: (subscriptionId, {viewType, time}) => {
    return {
      subscriptionId,
      viewType,
      time
    };
  },

  transformData: data => Immutable.fromJS(data)
});
