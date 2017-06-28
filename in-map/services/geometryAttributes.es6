import { BufferAttribute } from 'in-map/3DLibProvider';

export function updateAttribute(geometry, attribute, data, numElements = 3) {
  if (geometry.attributes[attribute]) {
    if (geometry.attributes[attribute].array.length === data.length) {
      geometry.attributes[attribute].copyArray(data);
    } else {
      addAttributeData(geometry, attribute, data, numElements);
    }
  } else {
    addAttributeData(geometry, attribute, data, numElements);
  }

  geometry.attributes[attribute].needsUpdate = true;
}

function addAttributeData(geometry, attribute, data, numElements) {
  const dataArray = new Float32Array(data.length);
  for (let i = 0, length = data.length; i < length; i++) {
    dataArray[i] = data[i];
  }
  geometry.addAttribute(attribute, new BufferAttribute(dataArray, numElements));
}
