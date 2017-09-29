import { create } from 'reactive-observables';
import { fromJS } from 'immutable';

export default () => {
  return create().startWith(fromJS([]));
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
