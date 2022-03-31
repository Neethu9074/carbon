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
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { latencyFixed } from 'in-services/formatters/number';
import { TestResponse } from 'in-synthetics/utils/constants';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { pie } from 'in-stores/metric/renderer';
import { getChartTestMetrics } from './utils';
import { TimeShift } from 'in-types';

type Props = {
  timeShiftConfig: TimeShift;
  test: TestResponse;
};

export default function ResponseStatus({ test, timeShiftConfig }: Props) {
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
            renderer: pie,
            metricIds: [],
            labels: []
          },
          title: `${t('in-synthetics:dashboard.summary.widgets.responseStatus')}`
        }}
        result={{ errors: [], progress: { loading: test.progress.loading } }}
      />
    );
  }
}

function renderChart(test: TestResponse, timeShiftConfig: TimeShift) {
  const locations: [] = get(test, ['data', 'locations']);
  const id = get(test, ['data', 'id']);
  let tagFilters = [
    {
      stringValue: id,
      name: 'testId',
      operator: EQUALS
    }
  ];

  const testMetricConfig: Metric = {
    aggregation: 'MEAN',
    source: 'SYNTHETICS',
    tagFilters: tagFilters,
    timeShift: timeShiftConfig.offset,
    metric: 'status'
  };

  const chartTestMetrics = getChartTestMetrics(locations, testMetricConfig, timeShiftConfig, 'status');

  const metricConfigs = chartTestMetrics.map(m => m.config);
  const colors = chartTestMetrics.map(m => m.color);
  const renderer = pie.id;

  return (
    <UnifiedMetricsChart
      renderHistoricDataIndicator
      title={t('in-synthetics:dashboard.summary.widgets.responseStatus')}
      automaticallySize={false}
      reverseLegendOrder={Boolean(timeShiftConfig.offset)}
      reverseTooltipOrder
      shareMaxAxisDomain
      config={{
        y1: {
          renderer: renderer,
          formatter: 'number.compact',
          tooltipFormatter: latencyFixed.compact,
          calculateStackDifferences: true,
          metrics: metricConfigs,
          colors: colors
        },
        type: 'TIME_SERIES'
      }}
    />
  );
}
