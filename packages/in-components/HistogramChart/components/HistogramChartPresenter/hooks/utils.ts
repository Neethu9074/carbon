/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { FormatterFn } from 'in-stores/metric/formatters';
import { Bucket } from '../types';

export type Bins = [string | number | null, number][];

/**
 * Function that maps the bins in a number[][] Tuple format to Bucket[]
 * @param bins
 * @returns Bucket[]
 */
interface Props {
  bins: Bins;
  maxVisibleLabels: number;
}

export function createBinsArrayObject({ bins, maxVisibleLabels }: Props) {
  if (bins.length === 0) {
    return [];
  }

  const result: Bucket[] = [];

  for (let i = 0; i < bins.length; i++) {
    const isInfinity = bins[i][0] === null;
    const from = i === 0 ? null : bins[i - 1][0];
    const to = isInfinity ? null : bins[i][0];
    const calls = bins[i][1];

    const isTickVisible = isLabelVisible({
      bucketIndex: i,
      totalBuckets: bins.length,
      maxVisibleLabels
    });

    result.push({
      from,
      to,
      calls,
      tickMark: isTickVisible
    } as Bucket);
  }

  return result;
}

/**
 * Function that removes duplicates and aggregate data from bins
 * @param bins
 * @returns Bins
 */

export function groupBinsByFormattedValue(bins: Bins) {
  if (bins.length === 0) {
    return [];
  }

  const groupedValues: Map<string | number | null, number> = new Map();

  // Iterate through the array to remove duplicates and calculate the sum
  for (const [key, value] of bins) {
    if (groupedValues.has(key)) {
      groupedValues.set(key, groupedValues.get(key)! + value);
    } else {
      groupedValues.set(key, value);
    }
  }

  // Convert the unique values map to an array of tuples
  const result: Bins = Array.from(groupedValues.entries());

  return result;
}

/**
 * Function that checks if a label should be displayed in the chart
 *
 * @param totalBuckets - number - Total number of buckets.
 * @param maxVisibleLabels - number - The maximum number of items to be displayed in the chart. It doesn't consider first and last elements, that will always be visible.
 * @param bucketIndex - number - The index of the bucket to check for display status.
 * @returns boolean - The display status of the specified bucket index.
 */
export function isLabelVisible({
  bucketIndex,
  totalBuckets,
  maxVisibleLabels
}: {
  bucketIndex: number;
  totalBuckets: number;
  maxVisibleLabels: number;
}) {
  const firstBucketIndex = 0;
  const lastBucketIndex = totalBuckets - 1;
  const totalValuesBetweenFirstAndLastElement = totalBuckets - 2;

  const isFirstOrLastBucket = bucketIndex === firstBucketIndex || bucketIndex === lastBucketIndex;
  const isWithinMaxVisibleLabels = totalValuesBetweenFirstAndLastElement <= maxVisibleLabels;

  if (isFirstOrLastBucket || isWithinMaxVisibleLabels) {
    return true;
  }

  // Get interval of how many elements should be displayed
  const interval = Math.floor(totalValuesBetweenFirstAndLastElement / maxVisibleLabels);

  // If it's outside interval, it should not be displayed
  const isOutsideInterval = totalBuckets - bucketIndex < interval;

  if (isOutsideInterval || interval < 0) {
    return false;
  }

  return bucketIndex % (interval + 1) === 0;
}

/**
 * Calculates the maximum number of characters in a label from a groupedBins array.
 *
 * @param groupedBins - Bins - An array of grouped bins.
 * @returns number - The maximum number of characters in a label.
 */
export function getMaxLabelCharsCount(bins: Bins) {
  return bins.reduce((acc, currentValue, index) => {
    const valueString = String(currentValue[0]);
    const length = valueString.length;

    if (length > acc) {
      acc = length;
    }

    if (bins.length === index + 1 && valueString === 'null') {
      acc += 2; // add > and space
    }

    return acc;
  }, 0);
}

/**
 * Formats the bins array using the provided formatter function.
 * @param bins - The input array of bins.
 * @param formatter - The formatting function to be applied to each bin value.
 * @returns The modified bins array.
 */
export function formatBins(bins: Bins, formatter: FormatterFn) {
  if (bins.length === 0) {
    return [];
  }

  return bins.map(bin => {
    let value = bin[0] && formatter(Number(bin[0]));
    const specialCases = ['0', '0 B', '0ms'];

    const count = bin[1];

    if (bin[0] === null) {
      value = null;
    }

    // Handle special cases (when value is 0, 0B or 0ms)
    if (typeof value === 'string' && specialCases.includes(`${value}`)) {
      value = value?.replace('0', '1');
    }

    return [value, count];
  }) as Bins;
}
