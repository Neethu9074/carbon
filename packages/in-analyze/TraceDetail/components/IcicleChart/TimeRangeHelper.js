export function isOverlappedWith(timeRange, occupiedTimeRanges) {
  if (!occupiedTimeRanges || occupiedTimeRanges.length == 0) {
    return false;
  }

  occupiedTimeRanges.sort((timeRangeA, timeRangeB) => {
    return timeRangeA[0] - timeRangeB[0];
  });

  let freeTimeRangeStart = 0;

  for (const i in occupiedTimeRanges) {
    const occupiedTimeRange = occupiedTimeRanges[i];
    const freeTimeRange = [freeTimeRangeStart, occupiedTimeRange[0]];
    if (isInsideOf(timeRange, freeTimeRange)) {
      return false;
    }

    freeTimeRangeStart = occupiedTimeRange[1];
  }

  if (timeRange[0] >= freeTimeRangeStart) {
    return false;
  }

  return true;
}

function isInsideOf(timeRangeA, timeRangeB) {
  return timeRangeA[0] >= timeRangeB[0] && timeRangeA[1] <= timeRangeB[1];
}
