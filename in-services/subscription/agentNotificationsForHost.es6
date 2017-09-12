import { create } from 'reactive-observables';
import { fromJS } from 'immutable';

const ids = ['nginx.config_error', 'mysql.connection_error', 'solr.default_config_warning'];
const msgs = ['no config found', 'cannot connect to DB', 'you should not use a default config'];
export default () => {
  const notifications = [];
  for (let i = 0, length = Math.ceil(Math.random() * 3); i < length; i++) {
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
//
// export default createSubscription({
//   eventId: 'subscribe-agent-notifications-for-host',
//
//   getId({ snapshot }) {
//     return snapshot.getIn(['entityId', 'host']);
//   },
//
//   getData: (subscriptionId, { snapshot }) => {
//     return {
//       subscriptionId,
//       hostId: snapshot.getIn(['entityId', 'host']),
//       from: snapshot.get('from'),
//       to: snapshot.get('to')
//     };
//   }
// });
