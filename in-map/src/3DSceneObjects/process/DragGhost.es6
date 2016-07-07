import THREE from 'three';

import {addSceneObject, removeSceneObject} from 'in-map/src/stores/sceneStore';
import {addGhost, removeGhost} from 'in-map/src/stores/process/activeGhosts';
import {requestRendering} from 'in-map/src/stores/renderingStore';
import eventBus from 'in-map/src/eventbus';


const GHOST_MATERIAL = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0.25
});

export default class DragGhost {

  constructor(parent) {
    this.parent = parent;
    this.originalId = parent.id;
    this.currentPosition = new THREE.Vector3();

    const sceneObject = this.sceneObject = new THREE.Mesh(
      parent.getDragGhostGeometry(),
      GHOST_MATERIAL
    );
    addSceneObject(sceneObject);
    addGhost(this.originalId, sceneObject);

    this.dragObjectSubscription =  eventBus.on('dragObject').subscribe(newPos => {
      this.currentPosition.copy(newPos);
      this.sceneObject.position.copy(newPos);
      requestRendering();
    });
  }

  dispose() {
    this.dragObjectSubscription.dispose();

    removeGhost(this.originalId);
    removeSceneObject(this.sceneObject);

    const dropPosition = this.currentPosition;
    this.parent.getComponent('position').setPosition(dropPosition.x, dropPosition.y, dropPosition.z);
    this.currentPosition = null;

    this.sceneObject.geometry.dispose();
    this.sceneObject = null;

    this.originalId = null;
  }
}
