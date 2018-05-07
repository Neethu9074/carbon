import { create } from 'reactive-observables';
import { fromJS } from 'immutable';

export default () => {
  return create().startWith(fromJS([]));
};

// import createSubscription from 'in-subscription/subscription';

// export default createSubscription({
//   eventId: 'subscribe-agent-notifications',
//
//   getId({ query, timeConfig, focusedMoment }) {
//     return focusedMoment + query + timeConfig.to + timeConfig.windowSize;
//   },
//
//   getData: (subscriptionId, { query, focusedMoment, timeConfig }) => {
//     return {
//       subscriptionId,
//       query,
//       time: focusedMoment,
//       timeConfig
//     };
//   }
// });
