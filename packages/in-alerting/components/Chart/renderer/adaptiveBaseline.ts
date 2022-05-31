/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { allowedMultiplesOfRollupSizeMissingInCharts } from 'in-services/featureFlags';

/**
 * We are not passing maxDistanceBetweenDataPointsInMillis explicitly,
 * in our case granularity * allowedMultiplesOfRollupSizeMissingInCharts would be maxDistanceBetweenDataPointsInMillis
 *
 * baseline items may be before of current time-window, so we need to filter by minimum startTime
 */
export function updateThresholdPointsIfRequired(
  baseline: [number, number][],
  thresholdGranularity: number,
  startTime: number = 0
): [number, number][] {
  const result: [number, number][] = [];
  const halfBucketInMillis = thresholdGranularity * 0.5;

  let previousThresholdPoint;

  for (let i = 0; i < baseline.length; i++) {
    const currentThresholdPoint = baseline[i];
    const [currentTime, currentValue] = currentThresholdPoint;

    //filter out items before minimum start time
    if (currentTime < startTime) {
      continue;
    }

    const nextThresholdPoint = baseline[i + 1];

    // As adaptive baseline might not be continuous, instead of rendering a dot we would render a tiny line
    // in the event details view so threshold is clearly visible to the user.
    if (
      distanceBetweenThresholdPointsIsTooBig(currentThresholdPoint, previousThresholdPoint, thresholdGranularity) &&
      distanceBetweenThresholdPointsIsTooBig(nextThresholdPoint, currentThresholdPoint, thresholdGranularity)
    ) {
      result.push(
        [Number(currentTime) - halfBucketInMillis, currentValue],
        [Number(currentTime) + halfBucketInMillis, currentValue]
      );
    } else {
      result.push(currentThresholdPoint);
    }

    previousThresholdPoint = currentThresholdPoint;
  }

  return result;
}

function distanceBetweenThresholdPointsIsTooBig(
  next: (string | number)[],
  current: (string | number)[] | undefined,
  thresholdGranularity: number
): boolean {
  return (
    !next ||
    !current ||
    Number(next[0]) - Number(current[0]) > thresholdGranularity * allowedMultiplesOfRollupSizeMissingInCharts
  );
}
