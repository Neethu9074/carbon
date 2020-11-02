import React from 'react';

import { average, getGranularity, getMetricKey } from 'in-infrastructure/Explore/services/metrics';
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import MetricLabel from 'in-infrastructure/Explore/components/MetricLabel';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import Header from 'in-infrastructure/Explore/components/Header';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import useCursorPagination from 'in-hooks/useCursorPagination';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Pill from 'in-new-components/Pill';

import locals from './InfrastructureList.mless';

export default function InfrastructureList({
  retrievalSize = 20,
  numSkeletonRows = 3,
  backendQueryModel,
  showHeader = false,
  availableMetrics,
  setMetrics,
  setOrder,
  metrics,
  order,
  type
}) {
  const timeConfig = useTimeConfig();
  const { items, totalHits, ...tableProps } = useCursorPagination(
    ({ cursor }) => getTableData({ timeConfig, retrievalSize, backendQueryModel, order, type, metrics, cursor }),
    [timeConfig, retrievalSize, backendQueryModel, type, order, metrics]
  );

  const columnDefinitions = [getLabelColumn({ timeConfig }), ...getMetricColumns({ metrics, sortable: showHeader })];

  return (
    <>
      {showHeader && (
        <Header
          availableMetrics={availableMetrics}
          setMetrics={setMetrics}
          totalHits={totalHits}
          metrics={metrics}
          hitName="Result"
        />
      )}
      <CursorPaginatedTable
        columnDefinitions={columnDefinitions}
        numSkeletonRows={numSkeletonRows}
        totalHits={totalHits}
        onChange={({ orderBy, orderDirection }) => setOrder({ by: orderBy, direction: orderDirection })}
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

function getLabelColumn({ timeConfig }) {
  return {
    id: 'label',
    label: 'Name',
    getContent(item) {
      const offlineTime = item.time < timeConfig.to ? item.time : undefined;
      return (
        <div className={locals.entityLink}>
          <EntityLink
            label={item.label}
            plugin={item.plugin}
            href$={getDashboardLink(item.snapshotId, { to: offlineTime })}
          />
          {offlineTime && (
            <Pill className={locals.pill} kind="lighter">
              offline
            </Pill>
          )}
        </div>
      );
    }
  };
}

function getMetricColumns({ metrics, sortable }) {
  return metrics.map(({ metric, label, formatter = String, isKpi }) => ({
    id: metric,
    label,
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
