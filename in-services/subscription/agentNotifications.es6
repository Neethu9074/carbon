import { create } from 'reactive-observables';
import { fromJS } from 'immutable';

const ids = ['nginx.config_error', 'mysql.connection_error', 'solr.default_config_warning'];
const msgs = ['no config found', 'cannot connect to DB', 'you should not use a default config'];
export default () => {
  const notifications = [];
  for (let i = 0, length = ids.length; i < length; i++) {
    notifications.push({
      id: ids[i],
      data: {
        message: msgs[i]
      }
    });
  }
  return create().startWith(fromJS(notifications));
};

// import createSubscription from 'in-services/subscription/subscription';

// export default createSubscription({
//   eventId: 'subscribe-agent-notifications',
//
//   getId({ query, timeframe, focusedMoment }) {
//     return focusedMoment + query + timeframe.to + timeframe.windowSize;
//   },
//
//   getData: (subscriptionId, { query, focusedMoment, timeframe }) => {
//     return {
//       subscriptionId,
//       query,
//       time: focusedMoment,
//       timeframe
//     };
//   }
// });
