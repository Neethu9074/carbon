import * as ro from 'reactive-observables';

import {selectedSnapshotId, getHighlightedMapEntity} from 'in-stores/snapshot';
import getHighlightedClusterMember from 'in-stores/highlightedClusterMember';
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


/*
  this store is used to highlight all cluster member/nodes if a cluster is highlighted or selected in some way
  bacause nodes should only be highlighted in the map, this store is map-only!
*/
export const highlightedEntityIds = createTrackingStore({
  name: 'highlightedEntityIdsInMap',
  observable: selectedSnapshotId
    .flatMap(snapshotId => {
      if (!snapshotId) {
        return alwaysNull;
      }
      return getHighlightedClusterMember(snapshotId);
    })
}).observable;
