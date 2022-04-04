/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export interface AdjustedTimeframe {
  to: number;
  from: number;
  numBuckets: number;
}

type Metrics = { data?: Record<string, Metric[]>; time: number; adjustedWindowSize: number };
type Metric = [MetricTimestamp, MetricValue];
type MetricTimestamp = number;
type MetricValue = number;

type MetricPostProcessor =
  | ((metric: Metric[], granularity: number, adjustedTo: number, adjustedWindowSize: number) => Metric[])
  | false
  | undefined;

export function applyPostProcessing<T extends Metrics>(
  metricsResult: T,
  postProcessMetric: MetricPostProcessor,
  granularity: number
): T {
  if (postProcessMetric && metricsResult.data) {
    const processedMetricsData: Record<string, Metric[]> = Object.entries(metricsResult.data).reduce(
      (resultMap: Record<string, Metric[]>, [metricName, metrics]) => {
        resultMap[metricName] = postProcessMetric(
          metrics,
          granularity,
          metricsResult.time,
          metricsResult.adjustedWindowSize
        );
        return resultMap;
      },
      {}
    );

    return {
      ...metricsResult,
      data: processedMetricsData
    };
  }
  return metricsResult;
}

/**
 * Because the backend metrics API does not provide the capability yet to define the filling behaviour of missing values,
 * we are applying zero filling in the client side. Furthermore, we are clipping incomplete values that the backend can
 * return in case the request-timeframe ranges into the future.
 * <p>
 * This could be removed as soon as the metric APIs provide such a capability.
 */
export const zeroFillAndClipMetric: MetricPostProcessor = (metricData, granularity, adjustedTo, adjustedWindowSize) => {
  const adjustedNow = adjustTimestamp(Date.now(), granularity);
  const trimmedAdjustedNow = Math.min(adjustedTo, adjustedNow);
  const trimmedAdjustedWindowSize = adjustedWindowSize - (adjustedTo - trimmedAdjustedNow);

  const adjustedTimeframe = adjustTimeframe(trimmedAdjustedNow, trimmedAdjustedWindowSize, granularity);

  if (metricData.length === adjustedTimeframe.numBuckets) {
    // do not modify the metric data when it is already complete
    return metricData;
  }

  // complete time-series with all values set to zero
  const resultMetricData: [number, number][] = Array(adjustedTimeframe.numBuckets)
    .fill(0)
    .map((_, idx) => [adjustedTimeframe.from + idx * granularity, 0]);

  // apply values that are actually present in the metric
  for (const item of metricData) {
    const timestamp = item[0];
    const value = item[1];
    const index = (timestamp - adjustedTimeframe.from) / granularity;

    // Because we might request a timeframe ranging into the future, such as for PP chart, our backend actually can return
    // partial buckets that are beyond the above adjustedNow. In this case, we want to ignore these values because they would
    // be incorrect, incomplete or misleading, especially in case of SUM aggregated metrics.
    if (index < resultMetricData.length) {
      resultMetricData[index][1] = value;
    }
  }

  return resultMetricData;
};

/**
 * Adjusts the timeframe to be left-aligned
 * @param to          The end of the timeframe.
 * @param windowSize  The width of the timeframe.
 * @param granularity The metric granularity.
 */
function adjustTimeframe(to: number, windowSize: number, granularity: number): AdjustedTimeframe {
  const adjustedTo: number = adjustTimestamp(to, granularity);
  const adjustedFrom: number = adjustedTo - windowSize;
  const numberOfBuckets: number = Math.floor(windowSize / granularity);

  return {
    to: adjustedTo,
    from: adjustedFrom,
    numBuckets: numberOfBuckets
  };
}

/**
 * Adjust timestamp to be left-aligned based on granularity to match with the definition for metric timestamps.
 * @param timestamp   The timestamp to adjust.
 * @param granularity The metric granularity.
 */
export function adjustTimestamp(timestamp: number, granularity: number) {
  return Math.floor(timestamp / granularity) * granularity;
}
