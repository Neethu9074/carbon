import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';
import {types} from 'in-stores/view';


export default createSubscription({
  eventId: 'subscribe-view',

  getId: ({viewType, time}) => viewType + time,

  getData: (subscriptionId, {viewType, time}) => {
    return {
      subscriptionId,
      viewType: viewType === types.process ? 'PROCESS' : viewType,
      time
    };
  },

  transformData: data => Immutable.fromJS(data)
});
