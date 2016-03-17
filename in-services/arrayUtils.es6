export function find(array, predicate) {
  for (let i = 0; i < array.length; i++) {
    if (predicate(array[i])) {
      // return fist match
      return array[i];
    }
  }
  // explicity return undefined
  return undefined;
}
