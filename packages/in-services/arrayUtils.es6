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

export function diff(a, b) {
  const result = {
    uniqueItemsA: [],
    sharedItems: [],
    uniqueItemsB: []
  };

  for (let i = 0; i < a.length; i++) {
    const currentNode = a[i];
    if (b.indexOf(currentNode) === -1) {
      result.uniqueItemsA.push(currentNode);
    } else {
      result.sharedItems.push(currentNode);
    }
  }

  for (let i = 0; i < b.length; i++) {
    const nextNode = b[i];
    if (a.indexOf(nextNode) === -1) {
      result.uniqueItemsB.push(nextNode);
    }
  }

  return result;
}
