import THREE from 'three';


export function updateAttribute(geometry, attribute, data, numElements = 3) {
  if (geometry.attributes[attribute]) {
    geometry.removeAttribute(attribute);
  }

  geometry.addAttribute(attribute, new THREE.BufferAttribute(new Float32Array(data), numElements));
  geometry.attributes[attribute].needsUpdate = true;
}
