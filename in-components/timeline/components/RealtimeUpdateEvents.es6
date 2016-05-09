import {to$, from$, focusedMoment$} from 'in-components/timeline/timelineStore';
import {selectedIncidentId$} from 'in-stores/incident';

/*
  this "class"is just to get all this realtime updates out of the canvas renderer class.
*/
export default function createRealtimeUpateEvents(realtimeDrawStream, changeSignal) {

  const selectedIncidentSubscription = selectedIncidentId$.subscribe(() => realtimeDrawStream.emit(changeSignal));
  const focusedMomentSubscription = focusedMoment$.subscribe(() => realtimeDrawStream.emit(changeSignal));
  const fromSubscription = from$.subscribe(() => realtimeDrawStream.emit(changeSignal));
  const toSubscription = to$.subscribe(() => realtimeDrawStream.emit(changeSignal));

  return {
    dispose
  };

  function dispose() {
    selectedIncidentSubscription.dispose();
    focusedMomentSubscription.dispose();
    fromSubscription.dispose();
    toSubscription.dispose();
  }
}
