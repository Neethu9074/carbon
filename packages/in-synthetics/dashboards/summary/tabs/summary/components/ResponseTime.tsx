/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { get } from 'lodash';
import React from 'react';

import { t } from '@instana/i18n-react';

//@ts-ignore
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
//@ts-ignore
import { integral } from 'in-stores/metric/renderer';
import { getChartGranularity } from 'in-stores/metric/metric';
import { latencyFixed } from 'in-services/formatters/number';
import { TestResponse } from 'in-synthetics/utils/constants';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TimeConfig, TimeShift } from 'in-types';
import { getChartTestMetrics } from './utils';

type Props = {
  timeShiftConfig: TimeShift;
  test: TestResponse;
};

export default function ResponseTime({ test, timeShiftConfig }: Props) {
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
            renderer: integral.id,
            metricIds: [],
            labels: []
          },
          cardTitle: `${t('in-synthetics:dashboard.summary.widgets.responseTimes')}`
        }}
        result={{ errors: [], progress: { loading: test.progress.loading } }}
      />
    );
  }
}

function renderChart(test: TestResponse, timeShiftConfig: TimeShift, timeConfig: TimeConfig, granularity: number) {
  const locations: [] = get(test, ['data', 'locations']);
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
    aggregation: 'MEAN',
    source: 'SYNTHETICS',
    tagFilters: tagFilters,
    timeConfig: timeConfig,
    timeShift: timeShiftConfig.offset
  };

  const chartTestMetrics = getChartTestMetrics(locations, testMetricConfig, timeShiftConfig, 'response_time');

  let metricConfigs;
  let renderer;
  let colors;

  metricConfigs = chartTestMetrics.map(m => ({
    metric: m.metric,
    label: m.label,
    ...m.config
  }));
  colors = chartTestMetrics.map(m => m.color);
  renderer = integral.id;

  return (
    <UnifiedMetricsChart
      renderHistoricDataIndicator
      title={t('in-synthetics:dashboard.summary.widgets.responseTimes')}
      timeConfig={timeConfig}
      automaticallySize={false}
      reverseLegendOrder={timeShiftConfig.offset}
      reverseTooltipOrder
      shareMaxAxisDomain
      config={{
        y1: {
          renderer: renderer,
          formatter: 'millis.compact',
          tooltipFormatter: latencyFixed.compact,
          calculateStackDifferences: true,
          metrics: metricConfigs,
          colors: colors
        },
        y2: {
          metrics: []
        },
        type: 'TIME_SERIES'
      }}
    />
  );
}
