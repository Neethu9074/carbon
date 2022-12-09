/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

export function findNextIndexToOpen(currentIndex, items) {
  for (let i = currentIndex + 1; i < items.length; i++) {
    if (!items[i].isDisabledForOpen) {
      return i;
    }
  }
  return currentIndex;
}

// export for test
export function findPrevIndexToOpen(currentIndex, items) {
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (!items[i].isDisabledForOpen) {
      return i;
    }
  }
  return currentIndex;
}
