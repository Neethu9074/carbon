/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { get } from 'lodash';
import React from 'react';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { TestResponse } from 'in-synthetics/utils/constants';
import { stackedBar } from 'in-stores/metric/renderer';
import { number } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { getChartTestMetrics } from './utils';
import { TimeShift } from 'in-types';
import { t } from 'in-i18n';

type Props = {
  timeShiftConfig: TimeShift;
  test: TestResponse;
};

export default function Failures({ test, timeShiftConfig }: Props) {
  const timeConfig = useTimeConfig();
  if (!test.progress.loading) {
    return renderChart(test, timeShiftConfig);
  } else {
    return (
      <ResultAwareChart
        config={{
          timeConfig,
          y1: {
            metrics: [],
            colors: [],
            renderer: stackedBar,
            metricIds: [],
            labels: []
          },
          title: `${t('in-synthetics:dashboard.summary.widgets.failures')}`
        }}
        result={{ errors: [], progress: { loading: test.progress.loading } }}
      />
    );
  }
}

function renderChart(test: TestResponse, timeShiftConfig: TimeShift) {
  const locations = get(test, ['data', 'locations']);
  const id = get(test, ['data', 'id']);

  let tagFilters = [
    {
      stringValue: id,
      name: 'testId',
      operator: EQUALS
    },
    {
      stringValue: '0',
      name: 'status',
      operator: EQUALS
    }
  ];

  const testMetricConfig: Metric = {
    aggregation: 'DISTINCT_COUNT',
    source: 'SYNTHETICS',
    tagFilters: tagFilters,
    timeShift: 0,
    metric: 'id'
  };

  const chartTestMetrics = getChartTestMetrics(locations, testMetricConfig, timeShiftConfig, 'status');

  const metricConfigs: Metric[] = chartTestMetrics.map(m => ({ label: m.label, ...m.config }));
  const colors = chartTestMetrics.map(m => m.color);
  const renderer = stackedBar.id;

  return (
    <UnifiedMetricsChart
      title={t('in-synthetics:dashboard.summary.widgets.failures')}
      renderHistoricDataIndicator
      automaticallySize={false}
      reverseLegendOrder={Boolean(timeShiftConfig.offset)}
      reverseTooltipOrder={Boolean(timeShiftConfig.offset)}
      config={{
        y1: {
          metrics: metricConfigs,
          colors: colors,
          formatter: 'number.compact',
          tooltipFormatter: number.compact,
          renderer: renderer
        },
        reverseOrder: false,
        type: 'TIME_SERIES'
      }}
    />
  );
}
