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

import locals from './InfrastructureList.mless';

export default function InfrastructureList({
  retrievalSize = 20,
  numSkeletonRows = 3,
  tagFilterExpression,
  type,
  showTotals = false
}) {
  const timeConfig = useTimeConfig();
  const [state, setState] = useReducer((prev, next) => ({ ...prev, ...next }), {
    orderBy: staticColumnDefinitions[0].id,
    orderDirection: 'ASC'
  });
  const { orderBy, orderDirection } = state;
  const { items, totalHits, ...tableProps } = useCursorPagination(
    ({ cursor }) =>
      getTableData({ timeConfig, retrievalSize, tagFilterExpression, orderBy, type, orderDirection, cursor }),
    [timeConfig, retrievalSize, tagFilterExpression, type, orderBy, orderDirection]
  );

  const columnDefinitions =
    useObservable(getColumnDefinitions({ timeConfig, tagFilterExpression, items }), [
      timeConfig,
      tagFilterExpression,
      items
    ]) || staticColumnDefinitions;

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

function getTableData({ timeConfig, retrievalSize, tagFilterExpression, type, orderBy, orderDirection, cursor }) {
  return getEntities({
    filter: {
      tagFilterExpression,
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

const staticColumnDefinitions = [
  {
    id: 'label',
    label: 'Name',
    getContent(item) {
      return (
        <EntityLink
          className={locals.link}
          label={item.label}
          plugin={item.plugin}
          href$={getDashboardLink(item.snapshotId)}
        />
      );
    }
  }
];

function getColumnDefinitions({ timeConfig, tagFilterExpression, items }) {
  if (items) {
    const plugins = new Set(items.map(i => i.plugin));
    if (plugins.size === 1) {
      const plugin = plugins.values().next().value;
      const defaultColumns = staticColumnDefinitions.concat(getKpiColumns(plugin));
      return getAllMetricColumns({ timeConfig, tagFilterExpression, plugin }).map(allMetricColumns =>
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

function getAllMetricColumns({ timeConfig, tagFilterExpression, plugin }) {
  return getAvailableMetrics({
    filter: {
      timeConfig,
      tagFilterExpression
    },
    plugin
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
