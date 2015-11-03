import THREE from 'three';

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
cubeGeometry.addAttribute('position', new THREE.BufferAttribute(new Float32Array(frontFaceCubeVertices), 3));
cubeGeometry.attributes.position.needsUpdate = true;

export const defaultGeometryMaterial = new THREE.MeshBasicMaterial();
