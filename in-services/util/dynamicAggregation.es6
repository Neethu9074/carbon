import { sortedIndexBy } from 'lodash';

import { dynamicRollupPredefinitions } from 'in-stores/metric/metric';

export function getBlockSizeMillis({ windowSize, maxDataPoints, minPixelsPerBlock, width, rollup }) {
  const userDefinedMaxDataPoints = maxDataPoints || windowSize / rollup;
  const userDefinedminPixelsPerBlock = minPixelsPerBlock || 10;

  const numDataPointsBasedOnPx = Math.floor(width / userDefinedminPixelsPerBlock);
  const numDataPoints = Math.min(userDefinedMaxDataPoints, numDataPointsBasedOnPx);

  const rawBlockSize = windowSize / numDataPoints;

  const dynamicCalculatedBlockSizeMillis = rollup * Math.ceil(rawBlockSize / rollup);

  return dynamicCalculatedBlockSizeMillis;
}

export function getPredefinedBlockSizeMillisForBlockSize(blockSizeMillis) {
  const i = Math.min(
    dynamicRollupPredefinitions.length - 1,
    sortedIndexBy(dynamicRollupPredefinitions, blockSizeMillis, column => column)
  );
  return dynamicRollupPredefinitions[i];
}
