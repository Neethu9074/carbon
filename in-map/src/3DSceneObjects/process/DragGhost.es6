import THREE from 'three';

import SceneObject from 'in-map/src/3DSceneObjects/common/SceneObject';
import eventBus from 'in-map/eventbus';


export default class DragGhost extends SceneObject {

  constructor(parent) {
    super({parent, id: parent.id + '__ghost'});

    console.log('start');
    this.getComponent('position').setPosition(0, 0, 0);
    const obj = this.obj = new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1, 1, 1, 1),
      new THREE.MeshBasicMaterial()
    );

    obj.position.set(0, 0, 0);
    this.scene.addSceneObject(obj);
    this.scene.renderScene();

    this.addSubscription(
      eventBus.on('dragObject').subscribe(event => {
        console.log(event);
      })
    );
  }

  dispose() {
    this.scene.removeSceneObject(this.obj);
    this.scene.renderScene();

    super.dispose();

    this.obj.geometry.dispose();
    this.obj.material.dispose();
    this.obj = null;

    console.log('stop');
  }
}
