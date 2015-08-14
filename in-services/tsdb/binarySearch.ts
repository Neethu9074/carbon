'use strict';

export function getSortedIndex(arr: number[], searchValue: number) {
  let lowerBound = 0;
  let upperBound = arr.length - 1;

  while (upperBound >= lowerBound) {
    const mid = lowerBound + Math.floor((upperBound - lowerBound) / 2);

    const currentValue = arr[mid];
    if (currentValue === searchValue) {
      return mid;
    } else if (currentValue < searchValue) {
      lowerBound = mid + 1;
    } else {
      upperBound = mid - 1;
    }
  }

  return lowerBound;
}
