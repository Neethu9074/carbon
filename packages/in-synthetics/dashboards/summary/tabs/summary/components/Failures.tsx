/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { get } from 'lodash';
import React from 'react';

//@ts-ignore
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
//@ts-ignore
import { stackedBar } from 'in-stores/metric/renderer';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { getChartGranularity } from 'in-stores/metric/metric';
import { TestResponse } from 'in-synthetics/utils/constants';
import { number } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TimeConfig, TimeShift } from 'in-types';
import { getChartTestMetrics } from './utils';

type Props = {
  timeShiftConfig: TimeShift;
  test: TestResponse;
};

export default function Failures({ test, timeShiftConfig }: Props) {
  const timeConfig = useTimeConfig();
  const granularity = getChartGranularity(timeConfig);
  if (!test.progress.loading) {
    return renderChart(test, timeShiftConfig, timeConfig, granularity);
  } else {
    return (
      <ResultAwareChart
        config={{
          granularity,
          y1: {
            metrics: [],
            colors: [],
            renderer: stackedBar.id,
            metricIds: [],
            labels: []
          },
          cardTitle: 'Failures'
        }}
        result={{ errors: [], progress: { loading: test.progress.loading } }}
      />
    );
  }
}

function renderChart(test: TestResponse, timeShiftConfig: TimeShift, timeConfig: TimeConfig, granularity: number) {
  const locations = get(test, ['data', 'locations']);
  const id = get(test, ['data', 'id']);

  let tagFilters = [
    {
      stringValue: id,
      name: 'testId',
      operator: EQUALS
    }
  ];

  const testMetricConfig = {
    granularity,
    aggregation: 'SUM',
    source: 'SYNTHETICS',
    tagFilters: tagFilters,
    timeConfig: timeConfig,
    timeShift: 0
  };

  const chartTestMetrics = getChartTestMetrics(locations, testMetricConfig, timeShiftConfig, 'status');

  let metricConfigs;
  let renderer;
  let colors;

  metricConfigs = chartTestMetrics.map(m => ({
    metric: m.metric,
    label: m.label,
    ...m.config
  }));
  colors = chartTestMetrics.map(m => m.color);
  renderer = stackedBar.id;

  return (
    <UnifiedMetricsChart
      title={'Failures'}
      renderHistoricDataIndicator
      timeConfig={timeConfig}
      automaticallySize={false}
      reverseLegendOrder={timeShiftConfig.offset}
      reverseTooltipOrder={timeShiftConfig.offset}
      config={{
        y1: {
          metrics: metricConfigs,
          colors: colors,
          formatter: 'number.compact',
          tooltipFormatter: number.compact,
          renderer: renderer
        },
        y2: {
          metrics: []
        },
        reverseOrder: false,
        type: 'TIME_SERIES'
      }}
    />
  );
}
