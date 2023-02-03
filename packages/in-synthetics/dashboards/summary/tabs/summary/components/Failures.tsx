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
import { TimeShift } from 'in-types';
import theme from 'in-themes';
import { t } from 'in-i18n';

type Props = {
  timeShiftConfig: TimeShift;
  test: TestResponse;
  renderPostChartContent: (a: any) => JSX.Element;
};

export default function Failures({ test, timeShiftConfig, renderPostChartContent }: Props) {
  const timeConfig = useTimeConfig();
  if (!test.progress.loading) {
    return (
      <RenderChart test={test} timeShiftConfig={timeShiftConfig} renderPostChartContent={renderPostChartContent} />
    );
  } else {
    return (
      <ResultAwareChart
        config={{
          timeConfig,
          y1: {
            metrics: [],
            colors: [],
            renderer: stackedBar.renderer,
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

const RenderChart = ({ test, timeShiftConfig, renderPostChartContent }: Props) => {
  const locations: string[] = get(test, ['data', 'locations']) || [];
  const locationDisplayLabels: string[] = get(test, ['data', 'locationDisplayLabels']) || [];
  const id = get(test, ['data', 'id']);

  let tagFilters = [];
  let testMetricConfigs: Metric[] = [];
  var locationDisplayLabel: string;
  let colors = [];
  for (let i = 0; i < locations.length; i++) {
    locationDisplayLabel = `${locationDisplayLabels[i]}`;
    tagFilters = [
      {
        stringValue: id,
        name: 'testId',
        operator: EQUALS
      },
      {
        numberValue: 0,
        name: 'status',
        operator: EQUALS
      },
      {
        stringValue: locations[i],
        name: 'locationId',
        operator: EQUALS
      }
    ];

    testMetricConfigs[i] = {
      aggregation: 'DISTINCT_COUNT',
      source: 'SYNTHETICS',
      tagFilters: tagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'id',
      label: locationDisplayLabel
    };

    colors[i] = theme.lib.colors.chart.strokeColors25[i];
  }

  const renderer = stackedBar.id;

  return (
    <UnifiedMetricsChart
      title={t('in-synthetics:dashboard.summary.widgets.failures')}
      renderHistoricDataIndicator
      renderPostChartContent={props =>
        renderPostChartContent({
          ...props,
          boundaryScope: 'ALL',
          chartName: 'Failure',
          alertRules: {
            errorRate: {
              rule: {
                alertType: 'failure',
                aggregation: 'DISTINCT_COUNT',
                metricName: 'testId'
              }
            }
          }
        })
      }
      automaticallySize={false}
      reverseLegendOrder={Boolean(timeShiftConfig.offset)}
      reverseTooltipOrder={Boolean(timeShiftConfig.offset)}
      config={{
        y1: {
          metrics: testMetricConfigs,
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
};
