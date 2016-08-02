import THREE from 'three';

import {addSceneObject, removeSceneObject} from 'in-map/stores/sceneStore';
import {requestRendering} from 'in-map/stores/renderingStore';
import {eventBus} from 'in-map/services/eventBus';


const GHOST_MATERIAL = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0.25
});

export default class DragGhost {
  constructor(parent, ghostGeometry) {
    this.originalId = parent.id;
    this.currentPosition = new THREE.Vector3();

    const sceneObject = this.sceneObject = new THREE.Mesh(
      ghostGeometry,
      GHOST_MATERIAL
    );
    addSceneObject(sceneObject);

    this.dragObjectSubscription = eventBus.on('dragObject').subscribe(newPos => {
      this.currentPosition.copy(newPos);
      this.sceneObject.position.copy(newPos);
      requestRendering();
    });
  }

  getCurrentPosition() {
    return this.currentPosition;
  }

  dispose() {
    this.dragObjectSubscription.dispose();

    removeSceneObject(this.sceneObject);

    this.sceneObject.geometry.dispose();
    this.sceneObject = null;

    this.currentPosition = null;
    this.originalId = null;
  }
}
