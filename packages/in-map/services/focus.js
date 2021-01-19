/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import CameraControllerServiceLocator from 'in-map/misc/serviceLocator/cameraController/CameraControllerServiceLocator';
import { selectedSnapshotIdForHighlightingInMap$ } from 'in-map/stores/selectedMapSceneObjectStore';
import { sceneObjects } from 'in-map/stores/focusableSceneObjectsStore';
import { emptyJsMap } from 'in-services/fixedObjects';

let focusableSceneObjects = emptyJsMap;
sceneObjects.stream.subscribe(objects => (focusableSceneObjects = objects));

export function focusId(id) {
  if (!id) {
    CameraControllerServiceLocator.focusMap();
  } else if (focusableSceneObjects.has(id)) {
    CameraControllerServiceLocator.flyToPosition(focusableSceneObjects.get(id).getFocusPosition());
  }
}

export function focusCurrentlyHighlightedEntity() {
  selectedSnapshotIdForHighlightingInMap$.once(highlightedId => focusId(highlightedId));
}

export function clampCameraPositionToVerticesDimensions() {
  CameraControllerServiceLocator.clampCameraPositionToVerticesDimensions();
}
