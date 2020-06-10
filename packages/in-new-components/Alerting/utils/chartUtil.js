import theme from 'in-themes';

export const chartColors = Object.freeze([
  theme.lib.colors.blue800,
  theme.lib.colors.red800,
  theme.lib.colors.lightBlue800,
  theme.lib.colors.pink800
]);

export const legendColors = Object.freeze([
  theme.lib.colors.blue800,
  theme.lib.colors.red800,
  theme.lib.colors.pink800_40
]);

export function smoothMetrics(metrics, granularity, weights = [0.27901, 0.44198, 0.27901]) {
  const windowSize = weights.length;
  const metricsLength = metrics.length;
  const leftRightCount = Math.trunc(windowSize / 2);
  const timeGapTooBig = (k, l) => Math.abs(metrics[k][1] - metrics[l][1]) > granularity;

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

export function getSmoothedMetricTooltipContent(isSmoothedMetric) {
  return isSmoothedMetric ? ['Smoothed metric'] : null;
}
