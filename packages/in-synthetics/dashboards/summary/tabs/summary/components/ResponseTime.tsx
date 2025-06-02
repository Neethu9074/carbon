/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import React from 'react';

import { t } from '@instana/i18n-react';

import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { locationIdTagName, runTypeTagName, testIdTagName } from 'in-synthetics/tags';
import { EQUALS, NOT_EQUAL } from 'in-components/QueryBuilder/tagFilter/operators';
import { runTypeCICD, runTypeScheduled } from 'in-synthetics/utils/constants';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { syntheticRunNowEnabled } from 'in-services/featureFlags';
import { latencyFixed } from 'in-services/formatters/number';
import { integral } from 'in-stores/metric/renderer';
import { chartColors } from 'in-themes/chartColors';
import { TimeShift } from 'in-types';

type Props = {
  timeShiftConfig: TimeShift;
  testId: string;
  renderPostChartContent: (a: any) => JSX.Element;
  locationIds: string;
  locationDisplayLabels: string;
  runType?: string;
};

export default function ResponseTime({
  testId,
  locationIds,
  locationDisplayLabels,
  timeShiftConfig,
  runType,
  renderPostChartContent
}: Props) {
  return (
    <RenderChart
      testId={testId}
      locationIds={locationIds}
      locationDisplayLabels={locationDisplayLabels}
      timeShiftConfig={timeShiftConfig}
      runType={runType}
      renderPostChartContent={renderPostChartContent}
    />
  );
}

const RenderChart = ({
  testId,
  locationIds,
  locationDisplayLabels,
  timeShiftConfig,
  runType,
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
      },
      ...(syntheticRunNowEnabled
        ? [
            {
              stringValue: runType === runTypeCICD ? runTypeScheduled : runType,
              name: runTypeTagName,
              operator: runType === runTypeCICD ? NOT_EQUAL : EQUALS
            }
          ]
        : [])
    ];

    testMetricConfigs[i] = {
      aggregation: 'MEAN',
      source: 'SYNTHETICS',
      tagFilters: tagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'response_time',
      label: locationDisplayLabel,
      color: chartColors.strokeColors25[i]
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
