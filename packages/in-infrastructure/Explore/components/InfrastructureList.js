import React, { useReducer } from 'react';

import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import Header from 'in-infrastructure/Explore/components/Header';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import useCursorPagination from 'in-hooks/useCursorPagination';
import MetricValue from 'in-components/MetricValue';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';

import locals from './InfrastructureList.mless';

export default function InfrastructureList({
  retrievalSize = 20,
  numSkeletonRows = 3,
  backendQueryModel,
  showHeader = false,
  availableMetrics,
  setMetrics,
  metrics,
  type
}) {
  const timeConfig = useTimeConfig();
  const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
    orderBy: 'label',
    orderDirection: 'ASC'
  });
  const { orderBy, orderDirection } = state;
  const { items, totalHits, ...tableProps } = useCursorPagination(
    ({ cursor }) =>
      getTableData({ timeConfig, retrievalSize, backendQueryModel, orderBy, type, orderDirection, cursor }),
    [timeConfig, retrievalSize, backendQueryModel, type, orderBy, orderDirection]
  );

  const columnDefinitions = [getLabelColumn({ timeConfig }), ...getMetricColumns({ metrics })];

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
        onChange={setState}
        {...tableProps}
        items={items}
        fixedLayout
        {...state}
      />
    </>
  );
}

function getTableData({ timeConfig, retrievalSize, backendQueryModel, type, orderBy, orderDirection, cursor }) {
  return getEntities({
    filter: {
      tagFilterExpression: backendQueryModel,
      timeConfig
    },
    order: {
      by: orderBy,
      direction: orderDirection
    },
    pagination: {
      retrievalSize,
      cursor
    },
    type
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

function getMetricColumns({ metrics }) {
  return metrics.map(({ metric, label, formatter, isKpi }) => ({
    id: metric,
    label,
    renderLabel,
    sortable: false,
    width: '15rem',
    widthInAbsoluteUnit: true,
    optional: true,
    defaultDisabled: !isKpi,
    getContent(item) {
      return <MetricValue snapshotId={item.snapshotId} metric={metric} formatter={formatter} />;
    }
  }));
}

function renderLabel({ label }) {
  const content = <span className={locals.metricLabel}>{label}</span>;
  // take a guess that the content will be truncated, although this is a bit hacky because
  // the truncation happens in CSS
  return label.length > 30 ? (
    <Tooltip content={label} align="bottomMiddle">
      {content}
    </Tooltip>
  ) : (
    content
  );
}
