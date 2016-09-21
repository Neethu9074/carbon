import Immutable from 'immutable';
import {create} from 'reactive-observables';


// TODO: remove this when backend provides shedEvents
export default () => {
  return create()
        .startWith([
          Immutable.fromJS({
            id: 'event1',
            start: Date.now() - 1000 * 60,
            title: 'this is a real shit problem',
            severity: 10
          }),
          Immutable.fromJS({
            id: 'event2',
            start: Date.now() - 1000 * 60 * 10,
            end: Date.now() - 1000 * 30,
            title: 'offline',
            severity: 0
          })
        ])
        .freeze();
};

// TODO: uncomment this when backend provides shedEvents
// import createSubscription from 'in-services/subscription/subscription';


// export default createSubscription(
//   // event ID
//   'subscribe-shed-event',
//
//   // getID
//   getId,
//
//   // data to be send for subscription
//   (subscriptionId, {maxTimestamp, minTimestamp, sortByField, sortMode, query, offset}) => {
//     return {
//       subscriptionId,
//       maxTimestamp: maxTimestamp > 0 ? maxTimestamp : undefined,
//       minTimestamp,
//       sortByField,
//       sortMode,
//       query,
//       offset
//     };
//   },
//
//   // no need to create an immutable list since we directly transform the data
//   events => events
// );
//
// function getId({maxTimestamp, minTimestamp, sortByField, sortMode, query, offset}) {
//   return maxTimestamp
//         + minTimestamp
//         + sortByField
//         + sortMode
//         + Math.round(Date.now() / 2000)
//         + query
//         + offset;
// }
