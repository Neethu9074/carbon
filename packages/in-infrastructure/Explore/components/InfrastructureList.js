/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import rpt from 'prop-types';
import React from 'react';

import { Message } from '@instana/components';

import MetricCatalogAndSortingConfigurator from 'in-infrastructure/components/MetricCatalogAndSortingConfigurator/MetricCatalogAndSortingConfigurator';
import { trackingProps as metricConfiguratorTrackingProps } from 'in-infrastructure/components/MetricCatalogConfigurator/MetricCatalogConfigurator';
import { average, getGranularity, getMetricKey } from 'in-infrastructure/Explore/services/metrics';
import { default as MetricLabel } from 'in-infrastructure/Explore/components/MetricLabel';
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import Header from 'in-components/QueryBuilder/components/Header';
import useCursorPagination from 'in-hooks/useCursorPagination';
import EntityLink from 'in-components/EntityLink/EntityLink';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { mapData } from 'in-services/util/result';
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
    ({ cursor }) => getTableData({ timeConfig, retrievalSize, backendQueryModel, order, type, metrics, cursor }),
    [timeConfig, retrievalSize, backendQueryModel, type, order, metrics]
  );

  const hasErrors = errors?.length > 0;
  const isLoading = progress?.loading;

  const columnDefinitions = [
    getLabelColumn({ timeConfig }, tracking?.onNavigateToEntity),
    ...getMetricColumns({ metrics, sortable: showHeader, metricMetadatas })
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
        />
      )}

      {hasErrors && (
        <Message type="error" withIcon small>
          {getErrorMessage(errors[0].message)}
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
  if (err.includes('more than the maximum number of groups')) {
    return t('in-infrastructure:explore.errors.maximumNumberOfGroups');
  }
}

function getTableData({ timeConfig, retrievalSize, backendQueryModel, type, order, metrics, cursor }) {
  return getEntities({
    filter: {
      tagFilterExpression: backendQueryModel,
      timeConfig
    },
    order,
    pagination: {
      retrievalSize,
      cursor
    },
    type,
    metrics: Object.fromEntries(
      metrics.flatMap(({ metric, aggregation }) => [
        // using a granularity smaller than window size here is a bit of a hack,
        // because BeeInstant buckets are defined on epoch boundaries. we use a smaller
        // granularity here to ensure this is synced up with grouped view KPIs
        [getMetricKey(metric, aggregation), { metric, granularity: getGranularity(timeConfig), aggregation }]
      ])
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

function getMetricColumns({ metrics, sortable, metricMetadatas }) {
  return metrics.map(({ metric, aggregation }) => {
    const id = getMetricKey(metric, aggregation);
    const metadata = mapData(metricMetadatas, data => data[metric]);
    const label = mapData(metadata, data => data?.label);
    const formatter = mapData(metadata, data => data?.formatter).data;
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
        const kpi = average(item.metrics[id]);
        return <span>{(kpi && formatter && formatter(kpi)) || '--'}</span>;
      }
    };
  });
}

export function pagesLoaded(offset, itemsPerPage) {
  return (offset || 0) / itemsPerPage + 2; // we are on page 1 when offset is 0, so nextPageNumber == 2
}

function getHeaderActions(props) {
  if (props.type === null) {
    return <></>;
  }
  return <MetricCatalogAndSortingConfigurator {...props} />;
}
