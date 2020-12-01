import { emptyObject } from 'in-services/fixedObjects';
import { urlFriendly } from 'in-services/util/json';
import { isBlank } from 'in-services/util/string';

export function getMatrixParameter(location, path, key) {
  return (location.matrix[path] || emptyObject)[key];
}

export function setOrDeleteMatrixParameter(location, matrixParameter, value) {
  setOrDeleteMatrixKey(
    location,
    matrixParameter.path,
    matrixParameter.name,
    value && matrixParameter['serializer'] ? matrixParameter.serializer(value) : value
  );
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

export function buildJsonSerializer() {
  return v => {
    if (!v) {
      return undefined;
    }
    return urlFriendly.stringify(v);
  };
}

export function buildJsonParser(fallback) {
  return str => {
    if (isBlank(str)) {
      return fallback;
    }

    try {
      return urlFriendly.parse(str);
    } catch (e) {
      return fallback;
    }
  };
}
