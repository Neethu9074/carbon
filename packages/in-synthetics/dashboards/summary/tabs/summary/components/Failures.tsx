/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { locationIdTagName, statusTagName, testIdTagName } from 'in-synthetics/tags';
import { EQUALS } from 'in-components/QueryBuilder/tagFilter/operators';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { stackedBar } from 'in-stores/metric/renderer';
import { number } from 'in-services/formatters/number';
import { chartColors } from 'in-themes/chartColors';
import { TimeShift } from 'in-types';
import { t } from 'in-i18n';

type Props = {
  timeShiftConfig: TimeShift;
  testId: string;
  renderPostChartContent: (a: any) => JSX.Element;
  locationIds: string;
  locationDisplayLabels: string;
};

export default function Failures({
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
  let colors = [];
  for (let i = 0; i < locations.length; i++) {
    locationDisplayLabel = `${locationDisplayLabelArray[i]}`;
    tagFilters = [
      {
        stringValue: testId,
        name: testIdTagName,
        operator: EQUALS
      },
      {
        numberValue: 0,
        name: statusTagName,
        operator: EQUALS
      },
      {
        stringValue: locations[i],
        name: locationIdTagName,
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

    colors[i] = chartColors.strokeColors25[i];
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
