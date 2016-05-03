import Immutable from 'immutable';

// import createSubscription from 'in-services/subscription/subscription';


import {create} from 'reactive-observables';

export default () => create().startWith(Immutable.fromJS([
  {
    id: 'foo',
    type: 'issue',
    start: Date.now() - 1000 * 60,
    end: Date.now(),
    problem: {
      severity: 10,
      snapshotId: 'haschmich'
    }
  }, {
    id: 'bar',
    type: 'issue',
    start: Date.now() - 1000 * 60 * 2,
    end: Date.now(),
    problem: {
      severity: 10,
      snapshotId: 'haschmich'
    }
  }
]));


// export default createSubscription(
//   // event ID
//   // TODO rename event
//   'subscribe-new-events',
//
//   // getID
//   timeframe => timeframe.to + ',' + timeframe.windowSize,
//
//   // data to be send for subscription
//   (subscriptionId, timeframe) => {
//     return {
//       subscriptionId,
//       timeframe
//     };
//   },
//
//   // data transformation on onData
//   events => Immutable.fromJS(events)
// );
