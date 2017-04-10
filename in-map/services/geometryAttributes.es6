import {BufferAttribute} from 'in-map/3DLibProvider';


export function updateAttribute(geometry, attribute, data, numElements = 3) {
  if (geometry.attributes[attribute]) {
    if (geometry.attributes[attribute].array.length === data.length) {
      geometry.attributes[attribute].copyArray(data);
    } else {
      geometry.addAttribute(attribute, new BufferAttribute(new Float32Array(data), numElements));
    }
  } else {
    geometry.addAttribute(attribute, new BufferAttribute(new Float32Array(data), numElements));
  }

  geometry.attributes[attribute].needsUpdate = true;
}
