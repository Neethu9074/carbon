import {selectedSnapshotIdForHighlightingInMap$} from 'in-map/stores/selectedMapSceneObjectStore';
import {sceneObjects} from 'in-map/stores/focusableSceneObjectsStore';
import {cameraController$} from 'in-map/stores/cameraController';


let focusableSceneObjects;
let currentCameraController;
cameraController$.subscribe(controller => currentCameraController = controller);
sceneObjects.stream.subscribe(objects => focusableSceneObjects = objects);

export function focusId(id) {
  if (!id && currentCameraController) {
    currentCameraController.map.centerMap();
  } else {
    const object = focusableSceneObjects[id];
    if (object && currentCameraController) {
      currentCameraController.flyToPosition(object.getFocusPosition());
    }
  }
}

export function focusCurrentlyHighlightedEntity() {
  selectedSnapshotIdForHighlightingInMap$.once(highlightedId => focusId(highlightedId));
}
