import THREE from 'three';

import Component from '../Component';


export default class PositionComponent extends Component {

  constructor({sceneObject}) {
    super(sceneObject, '_position');

    this.position = new THREE.Vector3(0, 0, 0);
    this.initialized();
  }

  setPosition(x, y, z) {
    const pos = this.position;
    if (pos.x === x && pos.y === y && pos.z === z) {
      return;
    }

    pos.set(x, y, z);
    this.needsUpdate = true;
  }

  update() {
    const newPosition = this.position;
    this.emit('positionChanged', newPosition);

    this.needsUpdate = false;
  }

  getPosition() {
    return this.position;
  }

  dispose() {
    super.dispose();
  }
}
