import THREE from 'three';

import {addSceneObject, removeSceneObject} from 'in-map/src/stores/sceneStore';
import {eventBus} from 'in-map/src/services/eventBus';


const GHOST_MATERIAL = new THREE.LineBasicMaterial({
  color: 0x627379,
  linewidth: navigator.platform.indexOf('Win') < 0 ? 2 : 1
});

export default class DragConnection {

  constructor(fromPosition) {
    fromPosition = fromPosition.clone();
    fromPosition.setX(fromPosition.x - 0.5);
    fromPosition.setZ(fromPosition.z + 0.5);

    const geometry = new THREE.Geometry();
    const sceneObject = this.sceneObject = new THREE.Line(geometry, GHOST_MATERIAL);

    addSceneObject(sceneObject);

    this.dragObjectSubscription =  eventBus.on('dragObject').subscribe(newPos => {
      geometry.vertices[0] = fromPosition;
      geometry.vertices[1] = newPos;
      geometry.verticesNeedUpdate = true;
    });
  }

  dispose() {
    this.dragObjectSubscription.dispose();

    removeSceneObject(this.sceneObject);

    this.sceneObject.geometry.dispose();
    this.sceneObject = null;
  }
}
