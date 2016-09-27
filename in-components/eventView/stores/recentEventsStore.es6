// import {combineLatest} from 'reactive-observables';
//
// import {createTrackingStore} from 'in-stores/store';
// import {alwaysNull} from 'in-services/fixedStreams';
// import {selectedEventId$} from 'in-stores/events';
// import {getEvent} from 'in-services/issueTracker';
import {create} from 'reactive-observables';
import Immutable from 'immutable';


export const recentEvents$ = create().startWith([Immutable.fromJS({
  id: 'id2',
  type: 'issue',
  start: Date.now() - 1000 * 40,
  problem: {
    fixSuggestion: 'fix it',
    severity: 10
  },
  snapshotId: 'asd',
  title: 'This is the first issue',
  severity: 10
}), Immutable.fromJS({
  id: 'id3',
  type: 'issue',
  start: Date.now() - 1000 * 40 * 10,
  end: Date.now() - 1000 * 40 * 4,
  problem: {
    fixSuggestion: 'fix it',
    severity: 5
  },
  snapshotId: 'asd',
  title: 'Big bang issue',
  severity: 5
}), Immutable.fromJS({
  id: 'id4',
  type: 'change',
  start: Date.now() - 1000 * 40,
  end: Date.now() - 1000 * 20,
  problem: {
    fixSuggestion: 'offline',
    severity: 0
  },
  snapshotId: 'asd',
  title: 'offline',
  severity: 0
})]);
//  createTrackingStore({
//   name: 'eventView/recentEvents',
//   observable: selectedEventId$.flatMap(id => id ? getEvent(id) : alwaysNull)
//                                              .flatMap(event => {
//                                                 const recentEvents = event
//                                                   ? event.get('recentEvents')
//                                                   : null;
//
//                                                return recentEvents
//                                                  ? combineLatest(recentEvents.toArray().map(id => getEvent(id)))
//                                                  : alwaysNull;
//                                              })
// }).observable;

export const sortedRecentEvents$ = recentEvents$.map(events =>
  events.slice().sort((a, b) => a.get('start') > b.get('start')));
