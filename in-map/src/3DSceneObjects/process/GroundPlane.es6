import THREE from 'three';

import {addSceneObject} from 'in-map/src/stores/sceneStore';

import BaseGroundPlane from '../common/GroundPlane';


export default class GroundPlane extends BaseGroundPlane {

  constructor({parent, size}) {
    super({parent, size});

    const ground = this.ground;
    ground.material.dispose();
    ground.material = new THREE.MeshBasicMaterial({
      depthWrite: false,
      color: new THREE.Color(0x455c64)
    });
    addSceneObject(ground);
  }

  onZoom() {}
}
