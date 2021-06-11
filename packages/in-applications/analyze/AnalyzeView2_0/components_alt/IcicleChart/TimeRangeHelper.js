/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { compare } from 'in-services/util/number';

export function isOverlappedWith(timeRange, occupiedTimeRanges) {
  if (!occupiedTimeRanges || occupiedTimeRanges.length == 0) {
    return false;
  }

  occupiedTimeRanges.sort((timeRangeA, timeRangeB) => compare(timeRangeA[0], timeRangeB[0]));

  let freeTimeRangeStart = 0;
  for (let i = 0; i < occupiedTimeRanges.length; i++) {
    const occupiedTimeRange = occupiedTimeRanges[i];
    if (isInsideOf(timeRange, [freeTimeRangeStart, occupiedTimeRange[0] - 1])) {
      return false;
    }

    freeTimeRangeStart = occupiedTimeRange[1] + 1;
  }

  return timeRange[0] < freeTimeRangeStart;
}

function isInsideOf(timeRangeA, timeRangeB) {
  return timeRangeA[0] >= timeRangeB[0] && timeRangeA[1] <= timeRangeB[1];
}
