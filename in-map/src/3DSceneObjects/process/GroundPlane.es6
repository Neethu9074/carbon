import THREE from 'three';

import BaseGroundPlane from '../common/GroundPlane';


export default class GroundPlane extends BaseGroundPlane {

  constructor({parent, size}) {
    super({parent, size});

    this.setColor(new THREE.Color(0x445b63));
    this.addSceneObject(this.ground);
  }
}
