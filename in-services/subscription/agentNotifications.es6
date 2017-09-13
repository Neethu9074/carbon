import { create } from 'reactive-observables';
import { fromJS } from 'immutable';

import { plugins } from 'in-forge/constants';

const ids = ['nginx.config_error', 'mysql.connection_error', 'solr.default_config_warning'];
const msgs = ['no config found', 'cannot connect to DB', 'you should not use a default config'];
const notificationPlugins = [plugins.nginx, plugins.mysql, plugins.solr];
const severities = [10, 5, 0];
const agentIds = ['5-RwxXyX_KTFcy32tBiNpqXifmY', 'F95wzOJnDZai2C2vqFjDFg2wcvg', 'io0H4TfoL92Xv6rJWIIUhwJY8wY'];

function getRandom(agentIds) {
  let n = Math.ceil(Math.random() * agentIds.length);
  var result = new Array(n),
    len = agentIds.length,
    taken = new Array(len);
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = agentIds[x in taken ? taken[x] : x];
    taken[x] = --len;
  }
  return result;
}

export default () => {
  const notifications = [];
  for (let i = 0, length = ids.length; i < length; i++) {
    notifications.push({
      id: ids[i],
      data: {
        severity: severities[i],
        plugin: notificationPlugins[i],
        agentIds: getRandom(agentIds),
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
