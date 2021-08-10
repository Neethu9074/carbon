/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import ChartingConfiguratorSection from 'in-components/ChartingConfigurator/ChartingConfiguratorSection';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import { getValueMatchTagFilter, LOG_LEVEL } from 'in-logging/queryBuilder';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import getLogGroups from 'in-logging/subscriptions/getLogGroups';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { pendingResult } from 'in-services/fixedObjects';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { error } from 'in-services/util/result';
import theme from 'in-themes';
import { t } from 'in-i18n';

import locals from './LogsDistributionChartSection.mless';

const options = [
  {
    metricId: 'logs_distribution',
    label: t('in-logging:logs'),
    formatter: 'number.compact',
    aggregations: [
      {
        id: 'SUM',
        label: t('in-logging:sum'),
        renderers: [{ id: 'bar', label: t('in-logging:bar') }]
      }
    ]
  }
];

export default function LogsDistributionChartSection(props) {
  const { chartedMetrics, onChartedMetricsChange, tracking } = props;

  return (
    <div className={locals.wrapper}>
      <ChartingConfiguratorSection
        value={chartedMetrics?.[0]}
        onChange={metric => onChartedMetricsChange(metric ? [metric] : [])}
        options={options}
        tracking={tracking}
        hideRenderer
        disableClose
      />

      <div className={locals.chartWrapper}>
        <Chart {...props} metric={chartedMetrics && chartedMetrics[0]} />
      </div>
    </div>
  );
}

function Chart(props) {
  const { isLoading, isGrouped, metric } = props;

  if (!metric) {
    return null;
  }

  if (isLoading) {
    return <ResultAwareChart result={pendingResult} config={{ customHeight: 215 }} />;
  }

  if (isGrouped) {
    return <GroupedLogsChart {...props} />;
  }

  return <LogsChart {...props} />;
}

function LogsChart({ backendQueryModel, metric }) {
  return (
    <UnifiedMetricsChart
      automaticallySize={false}
      renderLegend={false}
      excludedContextMenuActions={['globalHighlight', 'download']}
      config={{
        y1: {
          metrics: [
            getMetricConfig({
              backendQueryModel,
              metric,
              tag: LOG_LEVEL,
              value: 'ERROR',
              label: t('in-logging:logsOverTime', { context: 'ERROR' })
            }),
            getMetricConfig({
              backendQueryModel,
              metric,
              tag: LOG_LEVEL,
              value: 'WARN',
              label: t('in-logging:logsOverTime', { context: 'WARN' })
            }),
            getMetricConfig({
              backendQueryModel,
              metric,
              tag: LOG_LEVEL,
              value: 'INFO',
              label: t('in-logging:logsOverTime', { context: 'INFO' })
            })
          ],
          colors: [theme.lib.colors.failure, theme.lib.colors.warning, theme.lib.colors.lightBlue800],
          formatter: 'number.compact',
          renderer: 'stackedBar'
        },
        y2: { metrics: [] },
        type: 'TIME_SERIES'
      }}
    />
  );
}

function GroupedLogsChart({ filteringTagCatalog, metric, groupBy, backendQueryModel }) {
  const timeConfig = useTimeConfig();
  const { items, progress, errors } = useCursorPagination(
    params => getData({ timeConfig, groupBy, backendQueryModel, ...params }),
    [timeConfig.to, timeConfig.windowSize, timeConfig.autoRefresh, backendQueryModel, groupBy]
  );

  if (progress.loading) {
    return <ResultAwareChart result={pendingResult} config={{ customHeight: 215 }} />;
  } else if (errors && errors.length > 0) {
    return <ResultAwareChart result={error(errors)} config={{ customHeight: 215 }} />;
  }

  const topGroups = items.slice(0, 5).map(({ label }) => label);

  const tag = groupBy.groupbyTag;
  const type = filteringTagCatalog.tags.find(({ name }) => name === tag)?.type ?? 'STRING';
  const key = groupBy.groupbyTagSecondLevelKey;

  return (
    <UnifiedMetricsChart
      automaticallySize={false}
      renderLegend={false}
      config={{
        y1: {
          metrics: topGroups.map(label => getMetricConfig({ backendQueryModel, metric, tag, value: label, key, type })),
          formatter: 'number.compact',
          renderer: 'stackedBar'
        },
        y2: { metrics: [] },
        type: 'TIME_SERIES'
      }}
    />
  );
}

function getMetricConfig({ backendQueryModel, metric, tag, value, label, key, type }) {
  return {
    metric: metric.metricId,
    aggregation: metric.aggregationId,
    label: label ?? value,
    source: 'DISTRIBUTED_LOGS_V2',
    tagFilterExpression: addLogLevelFilterTagToQueryModel({ tag, value, backendQueryModel, key, type })

    // granularity and timeConfig are send automatically by the chart impl
  };
}

function addLogLevelFilterTagToQueryModel({ tag, value, backendQueryModel, key, type }) {
  return {
    elements: [getValueMatchTagFilter({ name: tag, key, type, value }), backendQueryModel],
    logicalOperator: 'AND',
    type: 'EXPRESSION'
  };
}

function getData({ timeConfig, cursor, backendQueryModel, groupBy }) {
  return getLogGroups({
    timeConfig,
    group: groupBy,
    tagFilterExpression: backendQueryModel,
    pagination: {
      cursor,
      retrievalSize: 20
    }
  });
}
