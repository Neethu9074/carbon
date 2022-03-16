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
  | ((metric: Metric[], granularity: number, toTime: number, adjustedWindowSize: number) => Metric[])
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
 * Because the backend metrics API does not provide the capability yet to define the filling behaviour of missing values, we are
 * applying zero filling in the client side. This could be removed as soon as the metric APIs provide such a capability.
 */
export const zeroFillMetric: MetricPostProcessor = (metricData, granularity, toTime, adjustedWindowSize) => {
  const adjustedTimeframe = getAdjustedTimeframe(toTime, adjustedWindowSize, granularity);

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

    resultMetricData[index][1] = value;
  }

  return resultMetricData;
};

function getAdjustedTimeframe(to: number, windowSize: number, granularity: number): AdjustedTimeframe {
  const adjustedTo: number = Math.floor(to / granularity) * granularity;
  const adjustedFrom: number = adjustedTo - windowSize;
  const numberOfBuckets: number = Math.floor(windowSize / granularity);

  return {
    to: adjustedTo,
    from: adjustedFrom,
    numBuckets: numberOfBuckets
  };
}
