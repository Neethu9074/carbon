/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { get } from 'lodash';
import React from 'react';

import { t } from '@instana/i18n-react';

import { EQUALS, GREATER_OR_EQUAL_THAN, LESS_THAN } from 'in-components/QueryBuilder/tagFilter/operators';
//@ts-ignore
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import { Metric } from 'in-custom-dashboards/widgets/Chart/types';
import { TestResponse } from 'in-synthetics/utils/constants';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { pie } from 'in-stores/metric/renderer';
import { TimeShift } from 'in-types';
import theme from 'in-themes';

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
            renderer: pie.renderer,
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
  const id = get(test, ['data', 'id']);

  const okTagFilters = [
    {
      stringValue: id,
      name: 'testId',
      operator: EQUALS
    },
    {
      numberValue: 200,
      name: 'status_code',
      operator: GREATER_OR_EQUAL_THAN
    },
    {
      numberValue: 300,
      name: 'status_code',
      operator: LESS_THAN
    }
  ];

  const redirectTagFilters = [
    {
      stringValue: id,
      name: 'testId',
      operator: EQUALS
    },
    {
      numberValue: 300,
      name: 'status_code',
      operator: GREATER_OR_EQUAL_THAN
    },
    {
      numberValue: 400,
      name: 'status_code',
      operator: LESS_THAN
    }
  ];

  const clientErrorTagFilters = [
    {
      stringValue: id,
      name: 'testId',
      operator: EQUALS
    },
    {
      numberValue: 400,
      name: 'status_code',
      operator: GREATER_OR_EQUAL_THAN
    },
    {
      numberValue: 500,
      name: 'status_code',
      operator: LESS_THAN
    }
  ];

  const serverErrorTagFilters = [
    {
      stringValue: id,
      name: 'testId',
      operator: EQUALS
    },
    {
      numberValue: 500,
      name: 'status_code',
      operator: GREATER_OR_EQUAL_THAN
    },
    {
      numberValue: 600,
      name: 'status_code',
      operator: LESS_THAN
    }
  ];

  let testMetricConfigs: Metric[] = [
    {
      aggregation: 'DISTINCT_COUNT',
      source: 'SYNTHETICS',
      tagFilters: okTagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'id',
      label: `${t('in-synthetics:dashboard.summary.widgets.ok')}`,
      color: theme.lib.colors.chart.strokeColors25[0]
    },
    {
      aggregation: 'DISTINCT_COUNT',
      source: 'SYNTHETICS',
      tagFilters: redirectTagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'id',
      label: `${t('in-synthetics:dashboard.summary.widgets.redirection')}`,
      color: theme.lib.colors.chart.strokeColors25[1]
    },
    {
      aggregation: 'DISTINCT_COUNT',
      source: 'SYNTHETICS',
      tagFilters: clientErrorTagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'id',
      label: `${t('in-synthetics:dashboard.summary.widgets.clientError')}`,
      color: theme.lib.colors.chart.strokeColors25[2]
    },
    {
      aggregation: 'DISTINCT_COUNT',
      source: 'SYNTHETICS',
      tagFilters: serverErrorTagFilters,
      timeShift: timeShiftConfig.offset,
      metric: 'id',
      label: `${t('in-synthetics:dashboard.summary.widgets.serverError')}`,
      color: theme.lib.colors.chart.strokeColors25[3]
    }
  ];

  const renderer = pie.id;

  return (
    <UnifiedMetricsChart
      renderHistoricDataIndicator
      title={t('in-synthetics:dashboard.summary.widgets.responseStatus')}
      automaticallySize={false}
      reverseLegendOrder={false}
      reverseTooltipOrder
      shareMaxAxisDomain
      config={{
        y1: {
          renderer: renderer,
          formatter: 'number.compact',
          tooltipFormatter: Number.toString,
          calculateStackDifferences: true,
          metrics: testMetricConfigs
        },
        type: 'SINGLE_NUMBER'
      }}
    />
  );
}
