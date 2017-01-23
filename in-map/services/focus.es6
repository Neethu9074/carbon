import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import {selectedSnapshotIdForHighlightingInMap$} from 'in-map/stores/selectedMapSceneObjectStore';
import {sceneObjects} from 'in-map/stores/focusableSceneObjectsStore';
import {AUTO_FOCUS} from 'in-map/misc/TimingConfig';
import {rawQuery$} from 'in-stores/search/rawQuery';


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


export function clampCameraPositionToVerticesDimensions() {
  CameraControllerServiceLocator.clampCameraPositionToVerticesDimensions();
}


export function init() {
  rawQuery$.debounce(AUTO_FOCUS).subscribe(clampCameraPositionToVerticesDimensions);
}
