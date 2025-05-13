/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';
import classNames from 'classnames';

import { LogGroupItem, TagFilterExpression, TimeConfig } from '@instana/types';
import { Group, IngestionOffsetCursor } from '@instana/types/typeDefinitions';
import { useObservable } from '@instana/hooks';

// @ts-expect-error needs TS migration
import ChartingConfiguratorSection from 'in-components/ChartingConfigurator/ChartingConfiguratorSection';
// @ts-expect-error needs TS migration
import GroupedChartingConfigurator from 'in-components/ChartingConfigurator/GroupedChartingConfigurator';
import { ChartProps, LogsDistributionChartSectionProps } from 'in-logging/analyze/AnalyzeView/components/Charts/types';
import { getLogsChartConfig, getMetricConfig } from 'in-logging/analyze/AnalyzeView/components/Charts/utils';
import { customChartHeight, logsChartOptions } from 'in-logging/analyze/AnalyzeView/components/Charts/constants';
import { useLoggingAnalyzeContext } from 'in-logging/analyze/AnalyzeView/LoggingAnalyzeContext';
import UnifiedMetricsChart from 'in-custom-dashboards/widgets/Chart/UnifiedMetricsChart';
import ResultAwareChart from 'in-components/Chart/ResultAwareChart';
import getLogGroups from 'in-logging/subscriptions/getLogGroups';
import { ChartedMetric } from 'in-applications/navigation/paths';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { pendingResult } from 'in-services/fixedObjects';
import Sections from 'in-components/workspace/Sections';
import { LOG_LEVEL } from 'in-logging/queryBuilder';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { error } from 'in-services/util/result';
import { t } from 'in-i18n';

import locals from 'in-logging/analyze/AnalyzeView/components/LogsDistributionChartSection.mless';

const placeholderTimeConfig = { to: null, windowSize: 1, autoRefresh: false };
const title = t('in-logging:logsCountSum');

export default function LogsDistributionChartSection(props: LogsDistributionChartSectionProps) {
  const { chartedMetrics, dataSource, onChartedMetricsChange, tracking, hideRenderer, disableClose, isDashboard } =
    props;
  const showChartMetricSelector = logsChartOptions?.metrics.length > 1;
  const metric = chartedMetrics?.[0];
  return (
    <Sections className={classNames({ [locals.wrapper]: locals.wrapper, [locals.noBorder]: isDashboard })}>
      {showChartMetricSelector && (
        <ChartingConfiguratorSection
          value={chartedMetrics?.[0]}
          onChange={(metric: ChartedMetric) => onChartedMetricsChange(metric ? [metric] : [])}
          dataSource={dataSource}
          ChartingConfigurator={GroupedChartingConfigurator}
          options={logsChartOptions}
          tracking={tracking}
          hideRenderer={hideRenderer}
          disableClose={disableClose}
          unifiedMetricsSource="LOGS"
        />
      )}
      {metric && (
        <div className={classNames({ [locals.chartWrapper]: locals.chartWrapper, [locals.noBorder]: isDashboard })}>
          <Chart {...props} metric={metric} />
        </div>
      )}
    </Sections>
  );
}

function Chart(props: ChartProps) {
  const { isLoading, isGrouped, metric } = props;

  if (!metric) {
    return null;
  }

  if (isLoading) {
    return (
      <ResultAwareChart
        result={pendingResult}
        config={{ customHeight: customChartHeight, timeConfig: placeholderTimeConfig }}
      />
    );
  }
  if (isGrouped) {
    return <GroupedLogsChart {...props} />;
  }

  return <LogsChart {...props} />;
}

function LogsChart({ backendQueryModelWithFacets, metric, rightHeaderContent, facets, formModel }: ChartProps) {
  const timeConfig = useTimeConfig();
  const { setState, state } = useLoggingAnalyzeContext();

  const logGroupsResult =
    useObservable(
      () =>
        getLogGroups({
          tagFilterExpression: backendQueryModelWithFacets,
          timeConfig,
          group: { groupbyTag: LOG_LEVEL, groupbyTagEntity: 'NOT_APPLICABLE' },
          pagination: {
            retrievalSize: 20
          }
        }),
      [timeConfig.to, timeConfig.windowSize, backendQueryModelWithFacets]
    ) || pendingResult;

  const config =
    logGroupsResult.data &&
    getLogsChartConfig(backendQueryModelWithFacets as TagFilterExpression, metric, logGroupsResult.data.items);

  useEffect(() => {
    const prevExtraLogLevel = state.extraChartLogLevel;
    const nextExtraLogLevel = config?.y1.metrics[4]?.label;

    if (prevExtraLogLevel !== nextExtraLogLevel) setState({ extraChartLogLevel: nextExtraLogLevel });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);

  if (logGroupsResult.data) {
    return (
      <UnifiedMetricsChart
        customHeight={customChartHeight}
        automaticallySize={false}
        rightHeaderContent={rightHeaderContent}
        renderLegend
        timeConfig={timeConfig}
        facets={facets}
        formModel={formModel}
        title={title}
        excludedContextMenuActions={['globalHighlight', 'download']}
        config={config}
        renderErrorDetail
      />
    );
  }

  return (
    <ResultAwareChart
      result={pendingResult}
      config={{ customHeight: customChartHeight, timeConfig: placeholderTimeConfig }}
    />
  );
}

function GroupedLogsChart({
  filteringTagCatalog,
  metric,
  groupBy,
  getColor,
  backendQueryModelWithFacets,
  rightHeaderContent
}: ChartProps) {
  const timeConfig = useTimeConfig();
  const { items, progress, errors } = useCursorPagination<IngestionOffsetCursor, LogGroupItem>(
    params => getData({ timeConfig, groupBy, backendQueryModelWithFacets, ...params }),
    [timeConfig.to, timeConfig.windowSize, timeConfig.autoRefresh, backendQueryModelWithFacets, groupBy]
  );

  if (progress.loading) {
    return (
      <ResultAwareChart
        result={pendingResult}
        config={{ customHeight: customChartHeight, timeConfig: placeholderTimeConfig }}
      />
    );
  } else if (errors && errors.length > 0) {
    return (
      <ResultAwareChart
        result={error(errors)}
        config={{ customHeight: customChartHeight, timeConfig: placeholderTimeConfig }}
      />
    );
  }

  const topItems = items.slice(0, 5);
  const topGroups = topItems.map(({ label }) => label);
  const colors = getColor ? topItems.map((item, i) => getColor(item, i, groupBy)) : [];

  const tag = groupBy.groupbyTag;
  const type = filteringTagCatalog.tags.find(({ name }) => name === tag)?.type ?? 'STRING';
  const key = groupBy.groupbyTagSecondLevelKey;

  return (
    <UnifiedMetricsChart
      customHeight={customChartHeight}
      automaticallySize={false}
      renderLegend
      rightHeaderContent={rightHeaderContent}
      title={title}
      config={{
        y1: {
          colors,
          metrics: topGroups.map(label =>
            getMetricConfig({ backendQueryModelWithFacets, metric, tag, value: label, key, type })
          ),
          formatter: 'number.compact',
          renderer: 'stackedBar'
        },
        y2: { metrics: [] },
        type: 'TIME_SERIES'
      }}
    />
  );
}

function getData({
  timeConfig,
  backendQueryModelWithFacets,
  groupBy
}: {
  timeConfig: TimeConfig;
  backendQueryModelWithFacets: TagFilterExpression;
  groupBy: Group;
}) {
  return getLogGroups({
    timeConfig,
    group: groupBy,
    tagFilterExpression: backendQueryModelWithFacets,
    pagination: {
      retrievalSize: 20
    }
  });
}
