import Immutable from 'immutable';

import createSubscription from 'in-services/subscription/subscription';
import {types} from 'in-stores/view';


export default createSubscription(
  // event ID
  'subscribe-view',

  // getID
  ({viewType, time}) => viewType + time,

  // data to be send for subscription
  (subscriptionId, {viewType, time}) => {
    return {
      subscriptionId,
      viewType: viewType === types.process ? 'PROCESS' : viewType,
      time
    };
  },

  // data transformation on onData
  data => Immutable.fromJS(data)
);
