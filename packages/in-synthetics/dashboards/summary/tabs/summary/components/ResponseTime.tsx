/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { locationIdTagName, testIdTagName } from 'in-synthetics/tags';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { latencyFixed } from 'in-services/formatters/number';
import { integral } from 'in-stores/metric/renderer';
import { TimeShift } from 'in-types';
import theme from 'in-themes';

type Props = {
  timeShiftConfig: TimeShift;
  testId: string;
  renderPostChartContent: (a: any) => JSX.Element;
  locationIds: string;
  locationDisplayLabels: string;
};

export default function ResponseTime({
  testId,
  locationIds,
  locationDisplayLabels,
  timeShiftConfig,
  renderPostChartContent
}: Props) {
  return (
    <RenderChart
      testId={testId}
      locationIds={locationIds}
      locationDisplayLabels={locationDisplayLabels}
      timeShiftConfig={timeShiftConfig}
      renderPostChartContent={renderPostChartContent}
    />
  );
}

const RenderChart = ({
  testId,
  locationIds,
  locationDisplayLabels,
  timeShiftConfig,
  renderPostChartContent
}: Props) => {
  const locations: string[] = locationIds.split(',');
  const locationDisplayLabelArray: string[] = locationDisplayLabels.split(',');
  let tagFilters = [];
  let testMetricConfigs: Metric[] = [];
  var locationDisplayLabel: string;
  for (let i = 0; i < locations.length; i++) {
    locationDisplayLabel = `${locationDisplayLabelArray[i]}`;
    tagFilters = [
      {
        stringValue: testId,
        name: testIdTagName,
        operator: EQUALS
      },
      {
        stringValue: locations[i],
        name: locationIdTagName,
        operator: EQUALS
      }
    ];

    testMetricConfigs[i] = {
      aggregation: 'MEAN',
      source: 'SYNTHETICS',
      tagFilters: tagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'response_time',
      label: locationDisplayLabel,
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
};
