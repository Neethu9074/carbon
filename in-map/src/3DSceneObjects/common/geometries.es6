import THREE from 'three';

import {updateAttribute} from 'in-map/src/services/geometryAttributes';


const frontFaceCubeVertices = [
  // front
  -1, 0, 1,
  0, 0, 1,
  0, 1, 1,

  -1, 0, 1,
  0, 1, 1,
  -1, 1, 1,

  // top
  -1, 1, 1,
  0, 1, 1,
  0, 1, 0,

  -1, 1, 1,
  0, 1, 0,
  -1, 1, 0,

  // left
  -1, 0, 0,
  -1, 0, 1,
  -1, 1, 0,

  -1, 0, 1,
  -1, 1, 1,
  -1, 1, 0
];

// the basic geometry is a uniformed cube, where the pivot point is at the corner
export const cubeGeometry = new THREE.BufferGeometry();
updateAttribute(cubeGeometry, 'position', frontFaceCubeVertices);

export const defaultGeometryMaterial = new THREE.MeshBasicMaterial();
