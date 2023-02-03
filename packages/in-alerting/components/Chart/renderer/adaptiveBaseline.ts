/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { allowedMultiplesOfRollupSizeMissingInCharts } from 'in-services/featureFlags';
import { DataSeries } from 'in-components/Chart/renderer/types';

/**
 * Filters-out items before minimum startTime (if given).
 *
 * Replaces an entry with 2 entries, if it would be rendered as a point, because it would be too far away from its neighbors.
 *
 * We are not passing maxDistanceBetweenDataPointsInMillis - but it is calculated:
 * it is `granularity * allowedMultiplesOfRollupSizeMissingInCharts`
 *
 * @param baseline - items may be before of current time-window, so we need to filter by minimum startTime
 * @param thresholdGranularity - the bucket size used for extending
 * @param startTime - if omitted, then there is no filtering based on the time.
 *
 * @return a new list of baseline items.
 */
export function updateThresholdPointsIfRequired(
  baseline: DataSeries,
  thresholdGranularity: number,
  startTime: number = 0
): DataSeries {
  const result: DataSeries = [];
  const halfBucketInMillis = thresholdGranularity * 0.5;
  const maxDistanceBetweenDatapointsInMillis = thresholdGranularity * allowedMultiplesOfRollupSizeMissingInCharts;

  let previousThresholdPoint: [number, number] | undefined = undefined;

  for (let i = 0; i < baseline.length; i++) {
    const currentThresholdPoint: [number, number] = baseline[i];
    const [currentTime, currentValue] = currentThresholdPoint;

    //filter out items before minimum start time
    if (currentTime < startTime) {
      continue;
    }

    const nextThresholdPoint: [number, number] | undefined = baseline[i + 1];

    // As adaptive baseline might not be continuous, instead of rendering a dot we would render a tiny line
    // so that the threshold is clearly visible to the user.
    if (
      distanceBetweenThresholdPointsIsTooBig(
        currentThresholdPoint,
        previousThresholdPoint,
        maxDistanceBetweenDatapointsInMillis
      ) &&
      distanceBetweenThresholdPointsIsTooBig(
        nextThresholdPoint,
        currentThresholdPoint,
        maxDistanceBetweenDatapointsInMillis
      )
    ) {
      result.push([currentTime - halfBucketInMillis, currentValue], [currentTime + halfBucketInMillis, currentValue]);
    } else {
      result.push(currentThresholdPoint);
    }

    previousThresholdPoint = currentThresholdPoint;
  }

  return result;
}

/** Compares the timestamps of currentThresholdPoint and previousThresholdPoint if they are too far away:
 *
 * Only results in false, when time difference is smaller than given maxDistanceBetweenDatapointsInMillis.
 *
 * @param currentThresholdPoint Tuple containing currentThresholdPoint timestamp as its first item, or undefined
 * @param previousThresholdPoint Tuple containing currentThresholdPoint timestamp as its first item, or undefined
 * @param maxDistanceBetweenDatapointsInMillis base for comparision.
 * @return true if either currentThresholdPoint or previousThresholdPoint are undefined of do not have currentThresholdPoint timestamp.
 */
function distanceBetweenThresholdPointsIsTooBig(
  currentThresholdPoint: number[] | undefined,
  previousThresholdPoint: number[] | undefined,
  maxDistanceBetweenDatapointsInMillis: number
): boolean {
  return (
    !currentThresholdPoint ||
    !previousThresholdPoint ||
    currentThresholdPoint[0] - previousThresholdPoint[0] > maxDistanceBetweenDatapointsInMillis
  );
}
