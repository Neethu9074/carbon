import {to$, from$, focusedMoment$} from 'in-components/timeline/timelineStore';
import {highlightedEntityId} from 'in-services/stores/highlightedEntityId';
import {selectedIncidentId$} from 'in-stores/incident';
import {selectedSnapshotId} from 'in-stores/snapshot';

/*
  this "class"is just to get all this realtime updates out of the canvas renderer class.
*/
export default function createRealtimeUpateEvents(realtimeDrawStream, changeSignal) {

  const highlightedEntityIdSubscription = highlightedEntityId.subscribe(emitRealtimeSignal);
  const selectedSnapshotIdSubscription = selectedSnapshotId.subscribe(emitRealtimeSignal);
  const selectedIncidentSubscription = selectedIncidentId$.subscribe(emitRealtimeSignal);
  const focusedMomentSubscription = focusedMoment$.subscribe(emitRealtimeSignal);
  const fromSubscription = from$.subscribe(emitRealtimeSignal);
  const toSubscription = to$.subscribe(emitRealtimeSignal);

  return {
    dispose
  };

  function emitRealtimeSignal() {
    realtimeDrawStream.emit(changeSignal);
  }

  function dispose() {
    highlightedEntityIdSubscription.dispose();
    selectedSnapshotIdSubscription.dispose();
    selectedIncidentSubscription.dispose();
    focusedMomentSubscription.dispose();
    fromSubscription.dispose();
    toSubscription.dispose();
  }
}
