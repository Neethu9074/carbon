import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import {selectedSnapshotIdForHighlightingInMap$} from 'in-map/stores/selectedMapSceneObjectStore';
import {sceneObjects} from 'in-map/stores/focusableSceneObjectsStore';


let focusableSceneObjects = {};
sceneObjects.stream.subscribe(objects => focusableSceneObjects = objects);

export function focusId(id) {
  if (!id) {
    CameraControllerServiceLocator.focusMap();
  } else if (focusableSceneObjects[id]) {
    CameraControllerServiceLocator.flyToPosition(focusableSceneObjects[id].getFocusPosition());
  }
}

export function focusCurrentlyHighlightedEntity() {
  selectedSnapshotIdForHighlightingInMap$.once(highlightedId => focusId(highlightedId));
}
