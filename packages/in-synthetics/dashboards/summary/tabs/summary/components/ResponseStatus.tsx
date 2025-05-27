/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { get } from 'lodash';
import React from 'react';

import {
  MetricResult,
  Result,
  SyntheticUnifiedMetricConfiguration,
  TagFilter,
  TimeConfig,
  TimeShift,
  UnifiedMetricConfigurationUnion
} from '@instana/types';
import { useObservable } from '@instana/hooks';
import { t } from '@instana/i18n-react';

import { runTypeCICD, runTypeScheduled, TestResponse } from 'in-synthetics/utils/constants';
import { EQUALS, NOT_EQUAL } from 'in-components/QueryBuilder/tagFilter/operators';
import { NOT_APPLICABLE } from 'in-components/QueryBuilder/tagFilter/entities';
import { Config } from 'in-components/KpiCard/ResultAwareBigNumberKpiCard';
import { AxisColor, MetricDataSeries } from 'in-components/Chart/types';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { runTypeTagName, testIdTagName } from 'in-synthetics/tags';
import getUnifiedMetrics from 'in-subscription/getUnifiedMetrics';
import { syntheticRunNowEnabled } from 'in-services/featureFlags';
import Renderer from 'in-components/Chart/renderer/Renderer';
import useTimeShiftConfig from 'in-hooks/useTimeShiftConfig';
import { pendingResult } from 'in-services/fixedObjects';
import { number } from 'in-services/formatters/number';
import { chartColors } from 'in-themes/chartColors';
import useTimeConfig from 'in-hooks/useTimeConfig';

type Props = {
  test: TestResponse;
  runType?: string;
};

export default function ResponseStatus({ test, runType }: Props) {
  const timeConfig = useTimeConfig();
  const timeShiftConfig = useTimeShiftConfig();

  if (!test.progress.loading) {
    return <RenderChart test={test} timeConfig={timeConfig} timeShiftConfig={timeShiftConfig} runType={runType} />;
  } else {
    return (
      <ResultAwareChart
        config={{
          timeConfig,
          y1: {
            metrics: [],
            colors: [],
            renderer: Renderer.pie,
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

type ChartProps = {
  test: TestResponse;
  timeConfig: TimeConfig;
  timeShiftConfig: TimeShift;
  runType?: string;
};

function RenderChart({ test, timeConfig, timeShiftConfig, runType }: ChartProps) {
  const metricKey = 'responseStatus';
  const id = get(test, ['data', 'id']);

  const config: Config<SyntheticUnifiedMetricConfiguration> = {
    metricConfiguration: {
      aggregation: 'DISTINCT_COUNT',
      metric: 'id',
      source: 'SYNTHETICS',
      order: {
        by: 'status_code',
        direction: 'ASC'
      },
      tagFilters: [
        {
          stringValue: id,
          name: testIdTagName,
          operator: EQUALS,
          entity: NOT_APPLICABLE,
          type: 'TAG_FILTER'
        },
        ...(syntheticRunNowEnabled
          ? [
              {
                stringValue: runType === runTypeCICD ? runTypeScheduled : runType,
                name: runTypeTagName,
                operator: runType === runTypeCICD ? NOT_EQUAL : EQUALS,
                entity: NOT_APPLICABLE,
                type: 'TAG_FILTER'
              } as TagFilter
            ]
          : [])
      ],
      timeShift: timeShiftConfig,
      resultType: 'SINGLE_NUMBER',
      timeConfig: timeConfig
    },
    comparisonDecreaseColor: 'redish',
    comparisonIncreaseColor: 'greenish'
  };

  const metrics: { [index: string]: UnifiedMetricConfigurationUnion } = {
    [metricKey]: {
      ...config.metricConfiguration,
      ...config.tagFilters
    }
  };

  const result: Result<MetricResult[]> =
    useObservable(() => getUnifiedMetrics({ metrics }), [config.metricConfiguration.timeShift, runType]) ??
    pendingResult;

  let distinctCount: number = 0;
  if (!result.progress.loading) {
    distinctCount = (result.data?.at(0)?.values?.length ?? 0) / 2;
  }

  // labels to be shown in the widget
  let statusCodeLabel: string[] = [];

  // map to labelize each status code in the widget
  let statusLabel = new Map();
  statusLabel.set(200, `${t('in-synthetics:dashboard.summary.widgets.ok')}`);
  statusLabel.set(201, `${t('in-synthetics:dashboard.summary.widgets.created')}`);
  statusLabel.set(202, `${t('in-synthetics:dashboard.summary.widgets.accepted')}`);
  statusLabel.set(400, `${t('in-synthetics:dashboard.summary.widgets.badRequest')}`);
  statusLabel.set(403, `${t('in-synthetics:dashboard.summary.widgets.forbidden')}`);
  statusLabel.set(404, `${t('in-synthetics:dashboard.summary.widgets.notFound')}`);
  statusLabel.set(500, `${t('in-synthetics:dashboard.summary.widgets.serverError')}`);
  statusLabel.set(502, `${t('in-synthetics:dashboard.summary.widgets.badGateway')}`);
  statusLabel.set(504, `${t('in-synthetics:dashboard.summary.widgets.gatewayTimeout')}`);

  // 2d array that contain statusCode and count pairs
  let metricPair: [number, number][] = [];

  if (!result.progress.loading) {
    for (let i = 0; i < distinctCount * 2; i = i + 2) {
      let count = get(result.data?.at(0), ['values', i, 1]) ?? 0;
      let statusCode = get(result.data?.at(0), ['values', i + 1, 1]) ?? 0;

      statusCodeLabel.push(statusCode?.toString() + '-' + statusLabel.get(statusCode));
      metricPair.push([statusCode, count]);
    }
  }

  // array of colors for labels
  let labelColors: AxisColor[] = [];
  for (let i = 0; i < distinctCount; i++) {
    labelColors.push(chartColors.strokeColors25[i]);
  }

  return (
    <ResultAwareChart
      result={result}
      config={{
        title: t('in-synthetics:dashboard.summary.widgets.responseStatus'),
        timeConfig: timeConfig,
        y1: {
          renderer: Renderer.pie,
          labels: statusCodeLabel,
          metricIds: [],
          metrics: generateMultipleMetrics(distinctCount, metricPair),
          colors: labelColors,
          formatter: number.compact
        }
      }}
    />
  );
}

/* metrics data in ResultAwareChart PieChart is a 3-d array, like
 *[
 *  [
 *   [200, 9]
 *  ],
 *  [
 *   [400, 9]
 *  ],
 *  [
 *   [500, 11]
 *  ]
 * ]
 */
function generateMultipleMetrics(numSeries: number, metricPair: [number, number][]): MetricDataSeries[] {
  let series: [number, number][][] = [];

  for (let i = 0; i < numSeries; i++) {
    series[i] = generateMetric(metricPair);
  }
  return series;
}

function generateMetric(metricPair: [number, number][]): [number, number][] {
  let metric: [number, number][] = [];

  for (let i = 0; i < metricPair.length; i++) {
    if (metricPair[i][0] != 0) {
      metric.push([metricPair[i][0], metricPair[i][1]]);
      metricPair.splice(i, 1);
      break;
    }
  }
  return metric;
}
