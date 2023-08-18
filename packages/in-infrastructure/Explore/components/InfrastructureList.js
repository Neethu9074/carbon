/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';
import rpt from 'prop-types';

import { Message } from '@instana/components';
import { just } from '@instana/observables';

import MetricCatalogAndSortingConfigurator from 'in-infrastructure/components/MetricCatalogAndSortingConfigurator/MetricCatalogAndSortingConfigurator';
import { trackingProps as metricConfiguratorTrackingProps } from 'in-infrastructure/components/MetricCatalogConfigurator/MetricCatalogConfigurator';
import {
  firstValue,
  getGranularity,
  getMetricKey,
  getMetricValue,
  getSeriesKey
} from 'in-infrastructure/Explore/services/metrics';
import { formatCsvColumnName, formatCsvColumnValue } from 'in-infrastructure/Explore/services/MetricCsvColumnFormatter';
import { getFormatter, getBackendTypeKeyByUiMetric } from 'in-services/formatters/backendFormatter';
import { default as MetricLabel } from 'in-infrastructure/Explore/components/MetricLabel';
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import { ChartsPresenter } from 'in-infrastructure/Explore/components/ChartsPresenter';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import Header from 'in-components/QueryBuilder/components/Header';
import useCursorPagination from 'in-hooks/useCursorPagination';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { isTechnicalError } from 'in-services/util/error';
import { pendingResult } from 'in-services/fixedObjects';
import HealthDot from 'in-components/health/HealthDot';
import CsvExporter from 'in-components/CsvExporter';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { mapData } from 'in-services/util/result';
import SparkChart from 'in-components/SparkChart';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

import locals from './InfrastructureList.mless';

export default function InfrastructureList({
  retrievalSize = 200,
  numSkeletonRows = 3,
  backendQueryModel,
  showHeader = false,
  setMetrics,
  sortableMetrics = false,
  setOrder = noop,
  getTotalItems,
  isLoadMoreEnabled = true,
  isPreview = false,
  fixedLayout = true,
  type,
  metrics,
  metricMetadatas,
  order,
  tracking,
  metricCatalog,
  query,
  onQueryChange,
  onChartedMetricsChange,
  chartedMetrics,
  setUrl,
  displayChart = true
}) {
  const timeConfig = useTimeConfig();
  const granularity = getGranularity(timeConfig);
  const metricsDependency = !isPreview ? [metrics] : [];

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
      getTableData({ timeConfig, granularity, retrievalSize, backendQueryModel, order, type, metrics, cursor }),
    [timeConfig, retrievalSize, backendQueryModel, type, order, ...metricsDependency]
  );

  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading;

  // Send totalHits
  useEffect(() => totalHits && getTotalItems?.(totalHits), [getTotalItems, totalHits]);

  const columnDefinitions = [
    {
      id: 'Health',
      label: <div className={locals.dot} />,
      width: '3rem',
      widthInAbsoluteUnit: true,
      sortable: false,
      getContent(item) {
        const problems = getAllIssues(
          item.entityHealthInfo?.openIssues,
          item.entityHealthInfo?.maxSeverity,
          t('in-infrastructure:explore.noIssues')
        );

        return (
          <HealthDot
            className={locals.dot}
            severity={item.entityHealthInfo?.maxSeverity}
            explanation={problems}
            iconSize={10}
          />
        );
      }
    },
    getLabelColumn(tracking?.onNavigateToEntity, isPreview),
    ...getMetricColumns({ metrics, sortable: showHeader || sortableMetrics, metricMetadatas, timeConfig, granularity })
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
          setUrl={setUrl}
        />
      )}
      {showHeader && (
        <Header
          setMetrics={setMetrics}
          totalRepresentedItemCount={totalRepresentedItemCount}
          totalRetainedItemCount={totalRetainedItemCount}
          totalHits={totalHits}
          hasErrors={hasErrors}
          isLoading={isLoading}
          metrics={metrics}
          metricMetadatas={metricMetadatas}
          tracking={tracking}
          CustomHeaderActions={getHeaderActions}
          type={type}
          backendQueryModel={backendQueryModel}
          metricCatalog={metricCatalog}
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
        <Message type="error" withIcon small>
          {getErrorMessage(errors[0])}
        </Message>
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

function getErrorMessage(err) {
  if (err.message?.includes('more than the maximum number of groups')) {
    return t('in-infrastructure:explore.errors.maximumNumberOfGroups');
  }

  if (isTechnicalError(err.code) && !__DEV__) {
    return t('in-components:error.erroneousResultPresenterMessage');
  }

  return t('in-infrastructure:explore.errors.generalError');
}

function getTableData({
  timeConfig,
  granularity,
  retrievalSize,
  backendQueryModel,
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
    type,
    metrics: Object.fromEntries(
      metrics
        .filter(({ metric, removeFromTable }) => metric !== undefined && metric !== null && !removeFromTable)
        .flatMap(({ metric, aggregation, crossSeriesAggregation }) => {
          const id = getMetricKey(metric, aggregation, crossSeriesAggregation);
          const kpiGranularity = timeConfig.windowSize;
          return [
            [id, { metric, granularity: kpiGranularity, aggregation, crossSeriesAggregation }],
            [getSeriesKey(id), { metric, granularity, aggregation, crossSeriesAggregation }]
          ];
        })
    )
  });
}

function getLabelColumn(onNavigateToEntity, isPreview) {
  return {
    id: 'label',
    label: t('in-infrastructure:explore.name'),

    getContent(item) {
      return (
        <div className={locals.entityLink}>
          <EntityLink
            label={item.label}
            plugin={item.plugin}
            href$={isPreview ? undefined : getDashboardLink(item.snapshotId, { pathname: '/physical/dashboard' })}
            onClick={
              isPreview
                ? noop
                : () => {
                    onNavigateToEntity?.(item.plugin);
                  }
            }
          />
        </div>
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
  setMetrics: rpt.func,
  fixedLayout: rpt.bool,
  onChartedMetricsChange: rpt.func,
  setOrder: rpt.func,
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
  query: rpt.string,
  onQueryChange: rpt.func,
  metricCatalog: rpt.object,
  chartedMetrics: rpt.array,
  setUrl: rpt.func,
  displayChart: rpt.bool
};

function getMetricColumns({ metrics, sortable, metricMetadatas, timeConfig, granularity }) {
  return metrics
    .filter(m => !m.removeFromTable)
    .map(({ metric, aggregation, crossSeriesAggregation, formatterId }) => {
      const id = getMetricKey(metric, aggregation, crossSeriesAggregation);
      const metadata = mapData(metricMetadatas, data => data[metric]);
      const label = mapData(metadata, data => data?.label);
      const isKpi = mapData(metadata, data => data?.isKpi).data || false;
      return {
        id,
        metric,
        label,
        aggregation: aggregation,
        renderLabel: MetricLabel,
        sortable,
        width: '15rem',
        widthInAbsoluteUnit: true,
        optional: true,
        defaultDisabled: !isKpi,
        headCellProps: { className: locals.metricLabel },
        getContent(item) {
          const id = getMetricKey(metric, aggregation);
          const metadata = mapData(metricMetadatas, data => data[metric]);
          const formatter = formatterId
            ? getFormatter(getBackendTypeKeyByUiMetric(formatterId))
            : mapData(metadata, data => data?.formatter).data;
          const label = mapData(metadata, data => data?.label);
          const renderedLabel = <MetricLabel label={label} aggregation={aggregation} />;
          const kpi = firstValue(item.metrics[id]);
          const series = item.metrics[getSeriesKey(id)];
          const percentageMetric = mapData(metadata, data => data?.percentageMetric).data;
          const metricValue = getMetricValue(kpi, formatter);
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
    });
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
