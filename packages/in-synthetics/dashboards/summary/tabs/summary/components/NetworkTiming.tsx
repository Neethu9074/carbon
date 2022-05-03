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
import { integral, stackedArea } from 'in-stores/metric/renderer';
import { TestResponse } from 'in-synthetics/utils/constants';
import { latencyFixed } from 'in-services/formatters/number';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TimeShift } from 'in-types';
import theme from 'in-themes';

type Props = {
  timeShiftConfig: TimeShift;
  test: TestResponse;
};

export default function NetworkTimings({ test, timeShiftConfig }: Props) {
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
            renderer: stackedArea,
            metricIds: [],
            labels: []
          },
          title: `${t('in-synthetics:dashboard.summary.widgets.networkTimings')}`
        }}
        result={{ errors: [], progress: { loading: test.progress.loading } }}
      />
    );
  }
}

function renderChart(test: TestResponse, timeShiftConfig: TimeShift) {
  const id = get(test, ['data', 'id']);
  const locations: string[] = get(test, ['data', 'locations']);
  let testMetricConfigs: Metric[] = [];

  for (let i = 0; i < locations.length; i++) {
    let defaultTagFilters = [
      {
        stringValue: id,
        name: 'testId',
        operator: EQUALS
      },
      {
        stringValue: locations[i],
        name: 'locationId',
        operator: EQUALS
      }
    ];
    testMetricConfigs = [
      {
        aggregation: 'MEAN',
        source: 'SYNTHETICS',
        tagFilters: defaultTagFilters,
        timeShift: timeShiftConfig.offset,
        metric: 'blocking',
        label: `${t('in-synthetics:dashboard.summary.widgets.blocking')}`,
        color: theme.lib.colors.chart.strokeColors25[0]
      },
      {
        aggregation: 'MEAN',
        source: 'SYNTHETICS',
        tagFilters: defaultTagFilters,
        timeShift: timeShiftConfig.offset,
        metric: 'dns',
        label: `${t('in-synthetics:dashboard.summary.widgets.dns')}`,
        color: theme.lib.colors.chart.strokeColors25[1]
      },
      {
        aggregation: 'MEAN',
        source: 'SYNTHETICS',
        tagFilters: defaultTagFilters,
        timeShift: timeShiftConfig.offset,
        metric: 'sending',
        label: `${t('in-synthetics:dashboard.summary.widgets.sending')}`,
        color: theme.lib.colors.chart.strokeColors25[2]
      },
      {
        aggregation: 'MEAN',
        source: 'SYNTHETICS',
        tagFilters: defaultTagFilters,
        timeShift: timeShiftConfig.offset,
        metric: 'waiting',
        label: `${t('in-synthetics:dashboard.summary.widgets.waiting')}`,
        color: theme.lib.colors.chart.strokeColors25[3]
      },
      {
        aggregation: 'MEAN',
        source: 'SYNTHETICS',
        tagFilters: defaultTagFilters,
        timeShift: timeShiftConfig.offset,
        metric: 'receiving',
        label: `${t('in-synthetics:dashboard.summary.widgets.receiving')}`,
        color: theme.lib.colors.chart.strokeColors25[4]
      }
    ];
  }

  const renderer = integral.id;

  return (
    <UnifiedMetricsChart
      renderHistoricDataIndicator
      title={t('in-synthetics:dashboard.summary.widgets.networkTimings')}
      automaticallySize={false}
      reverseLegendOrder={false}
      reverseTooltipOrder
      shareMaxAxisDomain
      config={{
        y1: {
          renderer: renderer,
          formatter: 'millis.compact',
          tooltipFormatter: latencyFixed.compact,
          calculateStackDifferences: true,
          metrics: testMetricConfigs
        },
        type: 'SINGLE_NUMBER'
      }}
    />
  );
}
