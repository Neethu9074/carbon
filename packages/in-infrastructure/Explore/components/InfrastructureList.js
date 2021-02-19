/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import rpt from 'prop-types';
import { t } from 'in-i18n';
import React from 'react';

import { trackingProps as metricConfiguratorTrackingProps } from 'in-new-components/MetricConfigurator/MetricConfigurator';
import { average, getGranularity, getMetricKey, defaultFormatter } from 'in-infrastructure/Explore/services/metrics';
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import MetricLabel from 'in-infrastructure/Explore/components/MetricLabel';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import Header from 'in-new-components/QueryBuilder/components/Header';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import useCursorPagination from 'in-hooks/useCursorPagination';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { noop } from 'in-services/util/function';
import Pill from 'in-new-components/Pill';

import locals from './InfrastructureList.mless';

export default function InfrastructureList({
  retrievalSize = 20,
  numSkeletonRows = 3,
  backendQueryModel,
  showHeader = false,
  availableMetrics,
  setMetrics,
  setOrder = noop,
  metrics,
  order,
  type,
  tracking
}) {
  const timeConfig = useTimeConfig();
  const { items, totalHits, loadMore: cursorPaginationDefaultLoadMore, cursor, ...tableProps } = useCursorPagination(
    ({ cursor }) => getTableData({ timeConfig, retrievalSize, backendQueryModel, order, type, metrics, cursor }),
    [timeConfig, retrievalSize, backendQueryModel, type, order, metrics]
  );

  const columnDefinitions = [
    getLabelColumn({ timeConfig }, tracking?.onNavigateToEntity),
    ...getMetricColumns({ metrics, sortable: showHeader })
  ];

  return (
    <>
      {showHeader && (
        <Header
          availableMetrics={availableMetrics}
          setMetrics={setMetrics}
          totalHits={totalHits}
          metrics={metrics}
          hitName="in-infrastructure:explore.hitNameResult"
          tracking={tracking}
        />
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
        {...tableProps}
        items={items}
        fixedLayout
        orderBy={order.by}
        orderDirection={order.direction}
      />
    </>
  );
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
          {offlineTime && (
            <Pill className={locals.pill} kind="lighter">
              {t('in-infrastructure:explore.offline')}
            </Pill>
          )}
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
  availableMetrics: rpt.array,
  setMetrics: rpt.func,
  setOrder: rpt.func,
  metrics: rpt.array,
  order: rpt.shape({
    by: rpt.string.isRequired,
    direction: rpt.string.isRequired
  }),
  type: rpt.string,
  tracking: rpt.shape({
    onLoadMore: rpt.func,
    onNavigateToEntity: rpt.func,
    ...metricConfiguratorTrackingProps
  })
};

function getMetricColumns({ metrics, sortable }) {
  return metrics.map(({ metric, aggregation, label, fullyQualifiedLabel, formatter = defaultFormatter, isKpi }) => ({
    id: getMetricKey(metric, aggregation),
    label: fullyQualifiedLabel ?? label,
    renderLabel: MetricLabel,
    sortable,
    width: '15rem',
    widthInAbsoluteUnit: true,
    optional: true,
    defaultDisabled: !isKpi,
    getContent(item) {
      const kpi = average(item.metrics[getMetricKey(metric, aggregation)]);
      return <span>{kpi !== undefined ? formatter(kpi) : '--'}</span>;
    }
  }));
}

export function pagesLoaded(offset, itemsPerPage) {
  return (offset || 0) / itemsPerPage + 2; // we are on page 1 when offset is 0, so nextPageNumber == 2
}
