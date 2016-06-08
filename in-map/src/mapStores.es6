import * as ro from 'reactive-observables';

import {selectedSnapshotId, getHighlightedMapEntity} from 'in-stores/snapshot';
import {createStore, createTrackingStore} from 'in-stores/store';
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


const processViewNodes = createStore({
  name: 'processViewNodeIdsStore',
  initialValue: {}
});

export const processViewNodes$ = processViewNodes.observable;

export function addNode(node) {
  processViewNodes.applyStateMutation(nodes => {
    nodes[node.id] = node;
    return nodes;
  });
}

export function removeNode(node) {
  processViewNodes.applyStateMutation(nodes => {
    nodes[node.id] = undefined;
    return nodes;
  });
}
