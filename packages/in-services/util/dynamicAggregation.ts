/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { sortedIndexBy } from 'lodash';

// @ts-ignore
import { sensibleGranularities } from 'in-stores/metric/metric';

interface Request {
  windowSize: number;
  maxDataPoints?: number;
  width: number;
  minPixelsPerBlock: number;
  rollup: number | undefined;
}

export function getBlockSizeMillis({ windowSize, maxDataPoints, minPixelsPerBlock, width, rollup }: Request) {
  rollup = rollup || 1000;
  const userDefinedMaxDataPoints = maxDataPoints || windowSize / rollup;
  const userDefinedMinPixelsPerBlock = minPixelsPerBlock || 10;

  const numDataPointsBasedOnPx = Math.floor(width / userDefinedMinPixelsPerBlock);
  const numDataPoints = Math.min(userDefinedMaxDataPoints, numDataPointsBasedOnPx);

  const rawBlockSize = Math.round(windowSize / numDataPoints);

  const dynamicCalculatedBlockSizeMillis = rollup * Math.ceil(rawBlockSize / rollup);

  return dynamicCalculatedBlockSizeMillis;
}

export function getPredefinedBlockSizeMillisForBlockSize(blockSizeMillis: number) {
  const i = Math.min(
    sensibleGranularities.length - 1,
    sortedIndexBy(sensibleGranularities, blockSizeMillis, column => column)
  );
  return sensibleGranularities[i];
}
