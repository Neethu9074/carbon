export function getKeyCount(obj) {
  let count = 0;

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      count++;
    }
  }

  return count;
}

export function shallowCopy(obj) {
  const clone = {};

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      clone[key] = obj[key];
    }
  }

  return clone;
}
