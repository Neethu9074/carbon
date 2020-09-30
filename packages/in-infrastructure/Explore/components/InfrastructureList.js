import React, { useMemo, useReducer } from 'react';
import { just } from 'reactive-observables';

import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import getAvailableMetrics from 'in-infrastructure/subscriptions/getAvailableMetrics';
import { valueWithFormatterToReadableString } from 'in-services/formatters/number';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import CountHeader from 'in-infrastructure/Explore/components/CountHeader';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import MetricValue from 'in-components/MetricValue';
import useObservable from 'in-hooks/useObservable';
import useTimeConfig from 'in-hooks/useTimeConfig';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';

import locals from './InfrastructureList.mless';

export default function InfrastructureList({
  retrievalSize = 20,
  numSkeletonRows = 3,
  backendQueryModel,
  type,
  showTotals = false
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

  const columnDefinitions = useObservable(getColumnDefinitions({ timeConfig, backendQueryModel, items }), [
    timeConfig,
    backendQueryModel,
    items
  ]) || [getLabelColumn({ timeConfig })];

  const optionalColumns = useMemo(() => columnDefinitions.filter(columnDefinition => columnDefinition.optional), [
    columnDefinitions
  ]);

  return (
    <>
      {showTotals && <CountHeader totalHits={totalHits} hitName="Result" />}
      <CursorPaginatedTable
        columnDefinitions={columnDefinitions}
        optionalColumns={optionalColumns}
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

function getColumnDefinitions({ timeConfig, backendQueryModel, items }) {
  const staticColumnDefinitions = [getLabelColumn({ timeConfig })];
  if (items) {
    const plugins = new Set(items.map(i => i.plugin));
    if (plugins.size === 1) {
      const plugin = plugins.values().next().value;
      const defaultColumns = staticColumnDefinitions.concat(getKpiColumns(plugin));
      return getAllMetricColumns({ timeConfig, backendQueryModel, plugin }).map(allMetricColumns =>
        defaultColumns.concat(allMetricColumns.filter(({ id }) => !defaultColumns.find(def => def.id === id)))
      );
    }
  }
  return just(staticColumnDefinitions);
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

function getKpiColumns(plugin) {
  const kpiDefinitions = getKpiDefinitions(plugin);

  return kpiDefinitions.map(({ label, metric, formatter }) => ({
    id: metric,
    label,
    sortable: false,
    width: '10rem',
    widthInAbsoluteUnit: true,
    optional: true,
    getContent(item) {
      return <MetricValue snapshotId={item.snapshotId} metric={metric} formatter={formatter} />;
    }
  }));
}

function getAllMetricColumns({ timeConfig, backendQueryModel, plugin }) {
  return getAvailableMetrics({
    filter: {
      timeConfig,
      tagFilterExpression: backendQueryModel
    },
    type: plugin
  })
    .map(availableMetrics => {
      if (availableMetrics.data) {
        return availableMetrics.data.metrics.map(({ id, label, format }) => {
          const formatter = v => valueWithFormatterToReadableString(v, format);
          return {
            id,
            label,
            renderLabel,
            sortable: false,
            width: '15rem',
            widthInAbsoluteUnit: true,
            optional: true,
            defaultDisabled: true,
            getContent(item) {
              return <MetricValue snapshotId={item.snapshotId} metric={id} formatter={formatter} />;
            }
          };
        });
      } else {
        return [];
      }
    })
    .startWith([]);
}
