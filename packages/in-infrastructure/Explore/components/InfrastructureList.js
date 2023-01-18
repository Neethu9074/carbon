/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import { Message } from '@instana/components';

import MetricCatalogAndSortingConfigurator from 'in-infrastructure/components/MetricCatalogAndSortingConfigurator/MetricCatalogAndSortingConfigurator';
import { trackingProps as metricConfiguratorTrackingProps } from 'in-infrastructure/components/MetricCatalogConfigurator/MetricCatalogConfigurator';
import { formatCsvColumnName, formatCsvColumnValue } from 'in-infrastructure/Explore/services/MetricCsvColumnFormatter';
import { firstValue, getGranularity, getMetricKey, getSeriesKey } from 'in-infrastructure/Explore/services/metrics';
import { default as MetricLabel } from 'in-infrastructure/Explore/components/MetricLabel';
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import Header from 'in-components/QueryBuilder/components/Header';
import useCursorPagination from 'in-hooks/useCursorPagination';
import EntityLink from 'in-components/EntityLink/EntityLink';
import { isTechnicalError } from 'in-services/util/error';
import CsvExporter from 'in-components/CsvExporter';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { mapData } from 'in-services/util/result';
import SparkChart from 'in-components/SparkChart';
import { noop } from 'in-services/util/function';
import { t } from 'in-i18n';

import locals from './InfrastructureList.mless';

export default function InfrastructureList({
  retrievalSize = 20,
  numSkeletonRows = 3,
  backendQueryModel,
  showHeader = false,
  setMetrics,
  setOrder = noop,
  type,
  metrics,
  metricMetadatas,
  order,
  tracking,
  metricCatalog,
  query,
  onQueryChange
}) {
  const timeConfig = useTimeConfig();
  const granularity = getGranularity(timeConfig);
  const {
    items,
    totalHits,
    totalRepresentedItemCount,
    totalRetainedItemCount,
    loadMore: cursorPaginationDefaultLoadMore,
    cursor,
    errors,
    progress,
    ...tableProps
  } = useCursorPagination(
    ({ cursor }) =>
      getTableData({ timeConfig, granularity, retrievalSize: 200, backendQueryModel, order, type, metrics, cursor }),
    [timeConfig, retrievalSize, backendQueryModel, type, order, metrics]
  );

  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading;

  const columnDefinitions = [
    getLabelColumn({ timeConfig }, tracking?.onNavigateToEntity),
    ...getMetricColumns({ metrics, sortable: showHeader, metricMetadatas, timeConfig, granularity })
  ];

  return (
    <>
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
        items={items}
        fixedLayout
        orderBy={order.by}
        orderDirection={order.direction}
      />
    </>
  );
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
        .filter(({ metric }) => metric !== undefined && metric !== null)
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

function getLabelColumn({ timeConfig }, onNavigateToEntity) {
  return {
    id: 'label',
    label: t('in-infrastructure:explore.name'),
    getContent(item) {
      const offlineTime = item.time < timeConfig.to ? item.time : undefined;
      return (
        <div className={locals.entityLink}>
          <EntityLink
            label={item.label}
            plugin={item.plugin}
            href$={getDashboardLink(item.snapshotId, { to: offlineTime })}
            onClick={() => onNavigateToEntity?.(item.plugin)}
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
  setMetrics: rpt.func,
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
  query: rpt.string,
  onQueryChange: rpt.func,
  metricCatalog: rpt.object
};

function getMetricColumns({ metrics, sortable, metricMetadatas, timeConfig, granularity }) {
  return metrics.map(({ metric, aggregation, crossSeriesAggregation }) => {
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
        const label = mapData(metadata, data => data?.label);
        const renderedLabel = <MetricLabel label={label} aggregation={aggregation} />;
        const formatter = mapData(metadata, data => data?.formatter).data;
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

function getMetricValue(kpi, formatter) {
  if (kpi !== undefined && kpi !== null) {
    //checking if kpi is falsy, valid kpi can be 0 as well
    return formatter ? formatter(kpi) : kpi;
  }
  return valueMissingPlaceholder;
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
      if (!found && col.id !== 'label') {
        row[col.getColumnLabel()] = '-';
      }
    });
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
  const csvFileName = 'infrastructure_entites_' + type + '.csv';

  const getAllData = ({ cursor }) =>
    getTableData({
      timeConfig,
      granularity,
      retrievalSize: 10000,
      backendQueryModel,
      type,
      order,
      metrics,
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
      <MetricCatalogAndSortingConfigurator {...props} />
    </>
  );
}
