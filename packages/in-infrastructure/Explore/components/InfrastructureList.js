/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect, useMemo } from 'react';
import { isEqual } from 'lodash';
import rpt from 'prop-types';

import { SeverityIndicatorCellContentWrapper } from '@instana/legacy';
import { useObservable } from '@instana/hooks';
import { just } from '@instana/observables';
import { Ul } from '@instana/components';

import {
  firstValue,
  getGranularity,
  getMetricKey,
  getMetricValue,
  getSeriesKey,
  lastValueForMetric,
  getMetricFormatterFromUnitOrDefault
} from 'in-infrastructure/Explore/services/metrics';
import MetricCatalogAndSortingConfigurator from 'in-infrastructure/components/MetricCatalogAndSortingConfigurator/MetricCatalogAndSortingConfigurator';
import { trackingProps as metricConfiguratorTrackingProps } from 'in-infrastructure/components/MetricCatalogConfigurator/MetricCatalogConfigurator';
import { formatCsvColumnName, formatCsvColumnValue } from 'in-infrastructure/Explore/services/MetricCsvColumnFormatter';
import { getLastValueTooltipLabel } from 'in-custom-dashboards/widgets/_shared/lastTimeConfig';
import { extremeValueInSeries, getThresholdColors } from 'in-components/Threshold/threshold';
import { default as MetricLabel } from 'in-infrastructure/Explore/components/MetricLabel';
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import { ChartsPresenter } from 'in-infrastructure/Explore/components/ChartsPresenter';
import HealthIndicatorPresenter from 'in-components/health/HealthIndicatorPresenter';
import ThresholdTooltip from 'in-infrastructure/Explore/components/ThresholdTooltip';
import { default as TagLabel } from 'in-infrastructure/Explore/components/TagLabel';
import { default as TagValue } from 'in-infrastructure/Explore/components/TagValue';
import { fixOrderForBackwardsCompatibility } from 'in-infrastructure/Explore/utils';
import { useGetDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import LiErrorList from 'in-infrastructure/Explore/components/LiErrorList';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import Header from 'in-components/QueryBuilder/components/Header';
import useCursorPagination from 'in-hooks/useCursorPagination';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { getFormatter } from 'in-stores/metric/formatters';
import { getSnapshot } from 'in-stores/snapshot/snapshot';
import { pendingResult } from 'in-services/fixedObjects';
import { tag_not_present_group } from '../constants';
import { getBaseUnit } from 'in-stores/metric/units';
import CsvExporter from 'in-components/CsvExporter';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { mapData } from 'in-services/util/result';
import SparkChart from 'in-components/SparkChart';
import { noop } from 'in-services/util/function';
import usePrevious from 'in-hooks/usePrevious';
import { t } from 'in-i18n';

import locals from './InfrastructureList.mless';

export default function InfrastructureList({
  retrievalSize = 200,
  numSkeletonRows = 3,
  backendQueryModel,
  showHeader = false,
  setMetrics,
  setTags,
  sortableMetrics = false,
  sortableTags = false,
  setOrder = noop,
  getTotalItems,
  isLoadMoreEnabled = true,
  isPreview = false,
  isWidget = false,
  fixedLayout = true,
  isSearchable = false,
  tags = [],
  type,
  metrics,
  metricMetadatas,
  order: incomingOrder,
  tracking,
  metricCatalog,
  tagCatalog,
  query,
  onQueryChange,
  onChartedMetricsChange,
  chartedMetrics,
  displayChart = true
}) {
  const timeConfig = useTimeConfig();
  const granularity = getGranularity(timeConfig);
  const previousMetrics = usePrevious(metrics);
  const dependencies = getDependencies({
    isPreview,
    isSearchable,
    hasMetricsChanged: !isEqual(previousMetrics, metrics),
    retrievalSize,
    metrics
  });
  const order = useMemo(() => fixOrderForBackwardsCompatibility(incomingOrder, metrics), [incomingOrder, metrics]);
  const {
    items,
    totalHits,
    totalRepresentedItemCount,
    totalRetainedItemCount,
    loadMore: cursorPaginationDefaultLoadMore,
    cursor,
    canLoadMore,
    errors,
    progress,
    ...tableProps
  } = useCursorPagination(
    ({ cursor }) =>
      getTableData({
        timeConfig,
        granularity,
        retrievalSize,
        backendQueryModel,
        order,
        tags,
        type,
        metrics,
        cursor
      }),
    [timeConfig, retrievalSize, backendQueryModel, type, order, ...dependencies]
  );

  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading;

  // Send totalHits
  useEffect(() => totalHits && getTotalItems?.(totalHits), [getTotalItems, totalHits]);

  // Keep only tags relevant to current type according to its catalog
  useEffect(() => {
    if (tagCatalog?.tagsByName) {
      const tagsForEntityType = tags.filter(tag => tagCatalog.tagsByName[tag]);
      if (tagsForEntityType.length !== tags.length) {
        setTags(tagsForEntityType);
      }
    }
  }, [tagCatalog, tags, setTags]);

  const columnDefinitions = [
    getLabelColumn(tracking?.onNavigateToEntity, isPreview, timeConfig),
    ...tags.map(tag => {
      const path = (tagCatalog.tagsByName && tagCatalog.tagsByName[tag]?.path?.map(node => node.label)) || [];
      return {
        id: tag,
        label: { data: path },
        renderLabel: TagLabel,
        width: '12rem',
        widthInAbsoluteUnit: true,
        sortable: showHeader || sortableTags,
        getContent: item => <TagValue value={item.tags[tag]} />
      };
    }),
    ...getMetricColumns({
      metrics,
      sortable: showHeader || sortableMetrics,
      metricMetadatas,
      timeConfig,
      granularity,
      isWidget
    }),
    {
      id: 'Health',
      label: t('in-infrastructure:explore.health'),
      width: '5rem',
      widthInAbsoluteUnit: true,
      sortable: false,
      getContent(item) {
        const problems = getAllIssues(
          item.entityHealthInfo?.openIssues,
          item.entityHealthInfo?.maxSeverity,
          t('in-infrastructure:explore.noIssues')
        );
        const openIssues = item.entityHealthInfo?.openIssues?.length ?? 0;
        const maxSeverity = item.entityHealthInfo?.maxSeverity ?? 0;
        return <HealthIndicatorPresenter openIssues={openIssues} maxSeverity={maxSeverity} tooltipLabel={problems} />;
      }
    }
  ];
  return (
    <>
      {displayChart && (
        <ChartsPresenter
          chartedMetrics={chartedMetrics}
          metricMetadatas={metricMetadatas}
          chartableDataSeries={undefined}
          metricCatalog={metricCatalog}
          isLoading={isLoading}
          isValid={!hasErrors}
          isGrouped={false}
          onChartedMetricsChange={onChartedMetricsChange}
          tagFilterExpression={backendQueryModel}
          type={type}
          tracking={tracking}
        />
      )}
      {showHeader && (
        <Header
          setMetrics={setMetrics}
          setTags={setTags}
          totalRepresentedItemCount={totalRepresentedItemCount}
          totalRetainedItemCount={totalRetainedItemCount}
          totalHits={totalHits}
          hasErrors={hasErrors}
          isLoading={isLoading}
          tags={tags}
          metrics={metrics}
          metricMetadatas={metricMetadatas}
          tracking={tracking}
          CustomHeaderActions={getHeaderActions}
          type={type}
          backendQueryModel={backendQueryModel}
          metricCatalog={metricCatalog}
          tagCatalog={tagCatalog}
          query={query}
          onQueryChange={onQueryChange}
          items={items}
          timeConfig={timeConfig}
          order={order}
          cursor={cursor}
          granularity={granularity}
          columns={columnDefinitions}
        />
      )}

      {hasErrors && (
        <Ul>
          <LiErrorList errors={errors} />
        </Ul>
      )}

      <CursorPaginatedTable
        columnDefinitions={columnDefinitions}
        numSkeletonRows={numSkeletonRows}
        totalHits={totalHits}
        onChange={({ orderBy, orderDirection }) => setOrder({ by: orderBy, direction: orderDirection })}
        loadMore={() => {
          cursorPaginationDefaultLoadMore();
          tracking?.onLoadMore?.(pagesLoaded(cursor?.offset, retrievalSize));
        }}
        progress={progress}
        {...tableProps}
        canLoadMore={canLoadMore && isLoadMoreEnabled}
        items={items}
        fixedLayout={fixedLayout}
        orderBy={order.by}
        orderDirection={order.direction}
      />
    </>
  );
}

function getAllIssues(issues, maxSeverity, defaultMsg) {
  if (maxSeverity > 0) {
    let openIssues = '';
    issues.forEach(issue => {
      if (maxSeverity === issue.problem.severity) openIssues = openIssues.concat(issue.problem.problemText + '\n');
    });
    return openIssues;
  }
  return defaultMsg;
}

function getTableData({
  timeConfig,
  granularity,
  retrievalSize,
  backendQueryModel,
  tags,
  type,
  order,
  metrics,
  cursor,
  fullData = false
}) {
  if (!backendQueryModel) {
    return just(pendingResult);
  }

  return getEntities({
    filter: {
      tagFilterExpression: backendQueryModel,
      timeConfig
    },
    order,
    pagination: {
      retrievalSize,
      cursor,
      fullData: fullData
    },
    tags,
    type,
    metrics: Object.fromEntries(
      metrics
        .filter(({ metric, removeFromTable }) => metric !== undefined && metric !== null && !removeFromTable)
        .flatMap(({ metric, aggregation, crossSeriesAggregation, regex, required }) => {
          const id = getMetricKey(metric, aggregation, crossSeriesAggregation);
          const kpiGranularity = timeConfig.windowSize;
          return [
            [id, { metric, granularity: kpiGranularity, aggregation, regex, crossSeriesAggregation, required }],
            [getSeriesKey(id), { metric, granularity, aggregation, regex, crossSeriesAggregation, required }]
          ];
        })
    ),
    missingPlaceholder: tag_not_present_group
  });
}
const DashboardLink = ({ item, isPreview, timeConfig, onNavigateToEntity }) => {
  const snapshot = useObservable(
    () => (item.snapshotId ? getSnapshot(item.snapshotId).map(snapshot => snapshot) : just({})),
    [item.snapshotId]
  );

  const time = item.time < timeConfig.to ? item.time : undefined;
  const getDashboardLink = useGetDashboardLink();
  return (
    <SeverityIndicatorCellContentWrapper severity={item.entityHealthInfo?.maxSeverity}>
      <div className={locals.entityLink}>
        <EntityLink
          label={item.label}
          plugin={item.plugin}
          snapshot={snapshot}
          href={
            isPreview
              ? undefined
              : getDashboardLink(item.snapshotId, {
                  pathname: '/physical/dashboard',
                  to: time,
                  focusedMoment: time
                })
          }
          onClick={
            isPreview
              ? noop
              : () => {
                  onNavigateToEntity?.(item.plugin);
                }
          }
        />
      </div>
    </SeverityIndicatorCellContentWrapper>
  );
};

function getLabelColumn(onNavigateToEntity, isPreview, timeConfig) {
  return {
    id: 'label',
    label: t('in-infrastructure:explore.name'),
    getContent(item) {
      return (
        <DashboardLink
          item={item}
          isPreview={isPreview}
          timeConfig={timeConfig}
          onNavigateToEntity={onNavigateToEntity}
        />
      );
    }
  };
}

InfrastructureList.propTypes = {
  retrievalSize: rpt.number,
  numSkeletonRows: rpt.number,
  backendQueryModel: rpt.object,
  showHeader: rpt.bool,
  sortableMetrics: rpt.bool,
  sortableTags: rpt.bool,
  setMetrics: rpt.func,
  setTags: rpt.func,
  fixedLayout: rpt.bool,
  onChartedMetricsChange: rpt.func,
  setOrder: rpt.func,
  tags: rpt.array,
  metrics: rpt.array,
  metricMetadatas: rpt.object,
  order: rpt.shape({
    by: rpt.string.isRequired,
    direction: rpt.string.isRequired
  }),
  type: rpt.string,
  tracking: rpt.shape({
    onLoadMore: rpt.func,
    onNavigateToEntity: rpt.func,
    ...metricConfiguratorTrackingProps
  }),
  getTotalItems: rpt.func,
  isLoadMoreEnabled: rpt.bool,
  isPreview: rpt.bool,
  isWidget: rpt.bool,
  isSearchable: rpt.bool,
  query: rpt.string,
  onQueryChange: rpt.func,
  metricCatalog: rpt.object,
  tagCatalog: rpt.object,
  chartedMetrics: rpt.array,
  displayChart: rpt.bool
};

function getMetricColumns({ metrics, sortable, metricMetadatas, timeConfig, granularity, isWidget }) {
  return metrics
    .filter(m => !m.removeFromTable)
    .map(
      ({
        metric,
        aggregation,
        crossSeriesAggregation,
        formatterId,
        isFormatterSelected,
        label: metricLabel,
        lastValue,
        unit,
        threshold
      }) => {
        const id = getMetricKey(metric, aggregation, crossSeriesAggregation);
        const metadata = mapData(metricMetadatas, data => data[metric]);
        const label = { data: metricLabel } ?? mapData(metadata, data => data?.label);
        const isKpi = mapData(metadata, data => data?.isKpi).data || false;

        return {
          id,
          metric,
          label,
          aggregation: aggregation,
          renderLabel: MetricLabel,
          sortable,
          width: isWidget ? 'auto' : '15rem',
          widthInAbsoluteUnit: true,
          optional: true,
          defaultDisabled: !isKpi,
          headCellProps: { className: locals.metricLabel },
          getContent(item) {
            const id = getMetricKey(metric, aggregation, crossSeriesAggregation);
            const metadata = mapData(metricMetadatas, data => data[metric]);
            const formatter = isFormatterSelected
              ? getFormatter(formatterId)
              : getMetricFormatterFromUnitOrDefault(getBaseUnit(unit), mapData(metadata, data => data?.formatter).data);

            const renderedLabel = <MetricLabel label={label} aggregation={aggregation} />;
            const seriesKey = getSeriesKey(id);
            const kpi = lastValue ? lastValueForMetric(item.metrics[seriesKey]) : firstValue(item.metrics[id]);
            const series = item.metrics[seriesKey];
            const percentageMetric = mapData(metadata, data => data?.percentageMetric).data;
            const metricValue = getMetricValue(kpi, formatter);
            const customValueTooltip = lastValue && getLastValueTooltipLabel(timeConfig);

            const extremeValue = extremeValueInSeries(threshold, series);
            const { strokeColor, fillColor } = getThresholdColors(threshold, extremeValue, formatterId);

            return (
              <SparkChart
                horizontalMetricValue={metricValue}
                percentageMetric={percentageMetric}
                metrics={series}
                tooltipFormatter={formatter}
                aggregation={aggregation}
                timeConfig={timeConfig}
                rollup={granularity}
                label={renderedLabel}
                customValueTooltip={customValueTooltip}
                strokeColor={strokeColor}
                fillColor={fillColor}
                customChartTooltip={threshold && <ThresholdTooltip threshold={threshold} formatter={formatter} />}
              />
            );
          },
          getColumnLabel() {
            const metadata = mapData(metricMetadatas, data => data[metric]);
            const label = mapData(metadata, data => data?.label);
            const formatter = mapData(metadata, data => data?.formatter).data;
            return formatCsvColumnName(label['data'], aggregation, formatter);
          },
          getFormatter() {
            const metadata = mapData(metricMetadatas, data => data[metric]);
            const formatter = mapData(metadata, data => data?.formatter).data;
            return formatter;
          }
        };
      }
    );
}

export function pagesLoaded(offset, itemsPerPage) {
  return (offset || 0) / itemsPerPage + 2; // we are on page 1 when offset is 0, so nextPageNumber == 2
}

function processData(items, columns) {
  let csvRows = [];
  items?.forEach(item => {
    let row = {};
    row['Name'] = item.label;

    columns.forEach(col => {
      let found = false;
      Object.keys(item.metrics ?? {}).forEach(metric => {
        if (metric === col.id) {
          row[col.getColumnLabel()] = formatCsvColumnValue(col.getFormatter(), firstValue(item.metrics[metric]));
          found = true;
        }
      });
      if (!found && col.id !== 'label' && col.id !== 'Health') {
        row[col.getColumnLabel()] = '-';
      }
    });
    row['Health'] = getAllIssues(item.entityHealthInfo?.openIssues, item.entityHealthInfo?.maxSeverity, '');
    csvRows.push(row);
  });

  return csvRows;
}

function getHeaderActions(props) {
  if (props.type === null) {
    return <></>;
  }

  const timeConfig = props.timeConfig;
  const backendQueryModel = props.backendQueryModel;
  const order = props.order;
  const type = props.type;
  const metrics = props.metrics;
  const tags = props.tags;
  const cursor = props.cursor;
  const columns = props.columns;
  const granularity = props.granularity;
  const csvFileName = 'infrastructure_entities_' + type + '.csv';

  const getAllData = ({ cursor }) =>
    getTableData({
      timeConfig,
      granularity,
      retrievalSize: 10000,
      backendQueryModel,
      tags,
      type,
      order,
      metrics: metrics.filter(m => !m.removeFromTable),
      cursor,
      fullData: true
    });

  return (
    <>
      <CsvExporter
        processData={processData}
        fetchData={getAllData}
        fileName={csvFileName}
        cursor={cursor}
        columns={columns}
      />
      <MetricCatalogAndSortingConfigurator {...props} metrics={metrics.filter(m => !m.removeFromTable)} />
    </>
  );
}

function getDependencies({ isPreview, isSearchable, hasMetricsChanged, retrievalSize, metrics }) {
  if (isPreview) {
    return [retrievalSize, hasMetricsChanged && metrics];
  }

  if (isSearchable) {
    return [];
  }

  return [metrics];
}
