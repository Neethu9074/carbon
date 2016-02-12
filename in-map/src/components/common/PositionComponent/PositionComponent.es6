import THREE from 'three';

import Component from '../Component';


export default class PositionComponent extends Component {

  constructor({sceneObject}) {
    super(sceneObject, '_position');

    this.position = new THREE.Vector3(0, 0, 0);
    this.oldPosition = new THREE.Vector3(0, 0, 0);
    this.initialized();
  }

  setPosition(x, y, z) {
    const pos = this.position;
    if (pos.x === x && pos.y === y && pos.z === z) {
      return;
    }

    this.oldPosition.set(pos.x, pos.y, pos.z);
    pos.set(x, y, z);

    this.needsUpdate = true;
  }

  update() {
    const oldPosition = this.oldPosition;
    const newPosition = this.position;

    this.sceneObject.positionChanged(newPosition.x, newPosition.y, newPosition.z, oldPosition);
    oldPosition.set(newPosition.x, newPosition.y, newPosition.z);
    this.needsUpdate = false;
  }

  getPosition() {
    return this.position;
  }

  dispose() {
    super.dispose();
  }
}
