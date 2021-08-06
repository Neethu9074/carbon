/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

/**
 * Applies smoothing to the given metrics time series using a gaussian kernel.
 */
export function smoothMetrics(
  metrics: number[][],
  granularity: number,
  weights: number[] = [0.157731, 0.684538, 0.157731]
): number[][] {
  const windowSize = weights.length;
  const metricsLength = metrics.length;
  const leftRightCount = Math.trunc(windowSize / 2);
  const timeGapTooBig = (k: number, l: number) => Math.abs(metrics[k][1] - metrics[l][1]) > granularity;

  return metrics.map((metric, i) => {
    let val = metric[1] * weights[Math.trunc(windowSize / 2)];
    let sumWeights = weights[Math.trunc(windowSize / 2)];

    for (let j = 1; j <= leftRightCount; j++) {
      let leftItemIndex = i - j;
      if (leftItemIndex < 0 || timeGapTooBig(i, leftItemIndex)) break;
      sumWeights += weights[leftRightCount - j];
      val += metrics[leftItemIndex][1] * weights[leftRightCount - j];
    }

    for (let j = 1; j <= leftRightCount; j++) {
      const rightItemIndex = i + j;
      if (rightItemIndex >= metricsLength || timeGapTooBig(i, rightItemIndex)) break;
      sumWeights += weights[leftRightCount - j];
      val += metrics[rightItemIndex][1] * weights[leftRightCount - j];
    }

    return [metric[0], sumWeights > 0 ? val / sumWeights : val];
  });
}
