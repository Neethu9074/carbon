import THREE from 'three';

import SceneObject from 'in-map/src/3DSceneObjects/common/SceneObject';
import eventBus from 'in-map/src/eventbus';


const GHOST_MATERIAL = new THREE.MeshBasicMaterial({
  transparent: true,
  opacity: 0.25
});

export default class DragGhost extends SceneObject {

  constructor(parent) {
    super({parent, id: parent.id + '__ghost'});

    this.currentPosition = new THREE.Vector3();

    const obj = this.obj = new THREE.Mesh(
      parent.getDragGhostGeometry(),
      GHOST_MATERIAL
    );

    this.scene.addSceneObject(obj);
    this.scene.renderScene();

    this.addSubscription(
      eventBus.on('dragObject').subscribe(newPos => {
        this.currentPosition.copy(newPos);
        this.obj.position.copy(newPos);
        this.scene.renderScene();
      })
    );
  }

  dispose() {
    super.dispose();

    this.scene.removeSceneObject(this.obj);

    const dropPosition = this.currentPosition;
    this.parent.getComponent('position').setPosition(dropPosition.x, dropPosition.y, dropPosition.z);
    this.currentPosition = null;

    this.obj.geometry.dispose();
    this.obj = null;
  }
}
