/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { getChartGranularity } from 'in-stores/metric/metric';
import Renderer from 'in-components/Chart/renderer/Renderer';
import { formatDate } from 'in-services/formatters/date';
import { number } from 'in-services/formatters/number';
import { compare } from 'in-services/util/number';

/**
 * Renders a chart of user usage information, if data is supplied.
 * @param {object} accountInfo The retrieved account information, including the user usage.
 * @param {string} dataSetName The name of the data set to be taken from the user usage.
 * @param {string} seriesLabel The label to be applied to the rendered series.
 */
export default function UserUsageChart({ accountInfo, dataSetName, seriesLabel }) {
  const dataSet = accountInfo?.data?.userUsage?.[dataSetName];
  if (!dataSet || Object.keys(dataSet).length === 0) {
    return null;
  }
  const result = dataSet[Object.keys(dataSet)[0]];
  const times = Object.keys(result)
    .map(timestamp => Number(timestamp))
    .sort((a, b) => compare(a, b));
  const to = times[times.length - 1];
  const timeframe = {
    windowSize: to - times[0],
    to
  };
  const granularity = getChartGranularity(timeframe);

  return (
    <ResultAwareChart
      result={{
        errors: [],
        progress: {
          loading: false
        }
      }}
      config={{
        granularity,
        timeConfig: timeframe,
        y1: {
          renderer: Renderer.line,
          labels: [seriesLabel],
          metricIds: [],
          metrics: times.length > 1 ? [times.map(timestamp => [timestamp, result[timestamp]])] : [],
          formatter: number.compact
        },
        tooltipTimeFormatter: formatDate,
        nonInteractive: true,
        customHeight: 300
      }}
    />
  );
}
