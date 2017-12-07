import { emptyObject } from 'in-services/fixedObjects';

export function getMatrixParameter(location, path, key) {
  return (location.matrix[path] || emptyObject)[key];
}

export function setOrDeleteMatrixKey(location, path, key, value) {
  if (value != null) {
    location.matrix[path] = location.matrix[path] || {};
    location.matrix[path][key] = value;
  } else {
    if (location.matrix[path]) {
      delete location.matrix[path][key];
    }
  }
}
