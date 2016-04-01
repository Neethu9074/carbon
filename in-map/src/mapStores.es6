import * as ro from 'reactive-observables';

import {selectedSnapshotId, getHighlightedMapEntity} from 'in-stores/snapshot';
import {createTrackingStore} from 'in-stores/store';
import {alwaysNull} from 'in-services/fixedStreams';


const roSpec = {emitLatestOnSubscribe: true};

export const longClickedSceneObject = ro.create(roSpec);
export const tooltipForSceneObject = ro.create(roSpec);
export const cursorPosition = ro.create(roSpec);
export const currentTooltip = ro.create(roSpec);
export const nodeMaxPower = ro.create(roSpec);
export const currentScene = ro.create(roSpec);

nodeMaxPower.emit(1);


export const selectedSnapshotIdForHighlightingInMap = createTrackingStore({
  name: 'selectedSnapshotIdForHighlightingInMap',
  observable: selectedSnapshotId
    .flatMap(snapshotId => {
      if (!snapshotId) {
        return alwaysNull;
      }
      return getHighlightedMapEntity(snapshotId);
    })
}).observable;
