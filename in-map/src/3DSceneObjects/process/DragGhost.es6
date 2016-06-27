import THREE from 'three';

import SceneObject from 'in-map/src/3DSceneObjects/common/SceneObject';
import eventBus from 'in-map/src/eventbus';


export default class DragGhost extends SceneObject {

  constructor(parent) {
    super({parent, id: parent.id + '__ghost'});

    this.currentPosition = new THREE.Vector3();

    const obj = this.obj = new THREE.Mesh(
      parent.getDragGhostGeometry(),
      new THREE.MeshBasicMaterial({
        transparent: true,
        opacity: 0.25
      })
    );

    obj.position.set(0, 0, 0);
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
    this.scene.removeSceneObject(this.obj);
    this.scene.renderScene();

    const dropPosition = this.currentPosition;
    this.parent.getComponent('position').setPosition(dropPosition.x, dropPosition.y, dropPosition.z);
    this.currentPosition = null;

    super.dispose();

    this.obj.geometry.dispose();
    this.obj.material.dispose();
    this.obj = null;
  }
}
