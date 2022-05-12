/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { get } from 'lodash';
import React from 'react';

import { t } from '@instana/i18n-react';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { latencyFixed } from 'in-services/formatters/number';
import { TestResponse } from 'in-synthetics/utils/constants';
import { integral } from 'in-stores/metric/renderer';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { TimeShift } from 'in-types';
import theme from 'in-themes';

type Props = {
  timeShiftConfig: TimeShift;
  test: TestResponse;
};

export default function ResponseTime({ test, timeShiftConfig }: Props) {
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
            renderer: integral,
            metricIds: [],
            labels: []
          },
          title: `${t('in-synthetics:dashboard.summary.widgets.responseTimes')}`
        }}
        result={{ errors: [], progress: { loading: test.progress.loading } }}
      />
    );
  }
}

function renderChart(test: TestResponse, timeShiftConfig: TimeShift) {
  const locations: string[] = get(test, ['data', 'locations']);
  const locationLabels: string[] = get(test, ['data', 'locationLabels']);
  const id = get(test, ['data', 'id']);
  let tagFilters = [];
  let testMetricConfigs: Metric[] = [];
  var locationLabel: string;
  for (let i = 0; i < locations.length; i++) {
    locationLabel = `${locationLabels[i]}`;
    tagFilters = [
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

    testMetricConfigs[i] = {
      aggregation: 'MEAN',
      source: 'SYNTHETICS',
      tagFilters: tagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'response_time',
      label: locationLabel,
      color: theme.lib.colors.chart.strokeColors25[i]
    };
  }

  const renderer = integral.id;

  return (
    <UnifiedMetricsChart
      renderHistoricDataIndicator
      title={t('in-synthetics:dashboard.summary.widgets.responseTimes')}
      automaticallySize={false}
      reverseLegendOrder={Boolean(timeShiftConfig.offset)}
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
        type: 'TIME_SERIES'
      }}
    />
  );
}
