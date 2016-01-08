import THREE from 'three';

import {hexToRGBNormalized} from 'in-services/converters';
import theme from 'in-services/theme';

import SceneObject from '../SceneObject';


export default class GroupPlane extends SceneObject {

  constructor({parent, size}) {
    super({parent, id: 'GroundPlane'});

    this.size = size;

    const color = hexToRGBNormalized(theme.map.colors.groundDots);
    const geo = new THREE.PlaneBufferGeometry(size, size, 1, 1);
    const mat = new THREE.MeshBasicMaterial({
      transparent: true,
      depthWrite: false,
      color: new THREE.Color(color.r, color.g, color.b)
    });

    const ground = this.ground = new THREE.Mesh(geo, mat);
    // turn the group around to make it visible. If we wouldn't be doing this,
    // then backface culling would make it invisible.
    ground.rotation.x = -90 * Math.PI / 180;
    ground.position.y = -0.02;

    // set static
    ground.matrixAutoUpdate = false;
    ground.rotationAutoUpdate = false;
    ground.updateMatrix();

    this.addSceneObject(ground);
  }

  getCollisionMesh() {
    return this.ground;
  }

  dispose() {
    super.dispose();

    // remove this ground from the parents scene
    this.removeSceneObject(this.ground);

    // clear three.js cache trough disposing
    this.ground.material.dispose();
    this.ground.geometry.dispose();
    this.ground = null;
  }
}
