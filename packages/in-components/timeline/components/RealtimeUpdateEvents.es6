import { to$, from$, focusedMoment$ } from 'in-components/timeline/timelineStore';
import { highlightedEntityId$ } from 'in-services/stores/highlightedEntityId';
import { selectedSnapshotId } from 'in-stores/snapshot';
import { highlightedMoment$ } from 'in-stores/timeline';

/*
  this "class"is just to get all this realtime updates out of the canvas renderer class.
*/
export default function createRealtimeUpateEvents(realtimeDrawStream, changeSignal) {
  const highlightedEntityIdSubscription = highlightedEntityId$.throttle(100).subscribe(emitRealtimeSignal); // throttle this to avoid flickering when moving the mosue fast over the map
  const selectedSnapshotIdSubscription = selectedSnapshotId.subscribe(emitRealtimeSignal);
  const focusedMomentSubscription = focusedMoment$.subscribe(emitRealtimeSignal);
  const fromSubscription = from$.subscribe(emitRealtimeSignal);
  const toSubscription = to$.subscribe(emitRealtimeSignal);
  const highlightedMomentSubscription = highlightedMoment$.subscribe(emitRealtimeSignal);

  return {
    dispose
  };

  function emitRealtimeSignal() {
    realtimeDrawStream.emit(changeSignal);
  }

  function dispose() {
    highlightedEntityIdSubscription.dispose();
    selectedSnapshotIdSubscription.dispose();
    highlightedMomentSubscription.dispose();
    focusedMomentSubscription.dispose();
    fromSubscription.dispose();
    toSubscription.dispose();
  }
}
