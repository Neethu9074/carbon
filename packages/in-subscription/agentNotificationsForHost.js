import { create } from 'reactive-observables';
import { fromJS } from 'immutable';

export default () => {
  return create().startWith(fromJS([]));
};

// import createSubscription from 'in-subscription/subscription';
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
