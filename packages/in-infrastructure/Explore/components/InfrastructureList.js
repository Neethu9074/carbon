import { just } from 'reactive-observables';
import React, { useMemo, useState } from 'react';

import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import getAvailableMetrics from 'in-infrastructure/subscriptions/getAvailableMetrics';
import { valueWithFormatterToReadableString } from 'in-services/formatters/number';
import { getDashboardLink } from 'in-stores/navigation/paths/dashboardPaths';
import getEntities from 'in-infrastructure/subscriptions/getEntities';
import EntityLink from 'in-new-components/EntityLink/EntityLink';
import { pendingResult } from 'in-services/fixedObjects';
import { getKpiDefinitions } from 'in-sdk/metrics/kpis';
import MetricValue from 'in-components/MetricValue';
import useObservable from 'in-hooks/useObservable';
import Tooltip from 'in-components/Tooltip';

import locals from './InfrastructureList.mless';

export default function InfrastructureList({ timeConfig, tagFilterExpression, pageSize = 20, numSkeletonRows = 3 }) {
  const [tableState, setTableState] = useState({
    orderBy: staticColumnDefinitions[0].id,
    orderDirection: 'ASC',
    page: 1,
    pageSize
  });

  const result =
    useObservable(getTableData({ timeConfig, tagFilterExpression, ...tableState }), [
      timeConfig,
      tagFilterExpression,
      tableState
    ]) || pendingResult;

  const columnDefinitions =
    useObservable(getColumnDefinitions({ timeConfig, tagFilterExpression, result }), [
      timeConfig,
      tagFilterExpression,
      result
    ]) || staticColumnDefinitions;

  const optionalColumns = useMemo(() => columnDefinitions.filter(columnDefinition => columnDefinition.optional), [
    columnDefinitions
  ]);

  const onChange = newState => setTableState(prev => Object.assign({}, prev, newState));

  return (
    <ServerTablePresenter
      columnDefinitions={columnDefinitions}
      optionalColumns={optionalColumns}
      numSkeletonRows={numSkeletonRows}
      onChange={onChange}
      isSearchable={false}
      pageSize={pageSize}
      result={result}
      {...tableState}
      fixedLayout
    />
  );
}

function getTableData({ timeConfig, page, pageSize, tagFilterExpression, orderBy, orderDirection }) {
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
      page,
      pageSize
    }
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

function getColumnDefinitions({ timeConfig, tagFilterExpression, result }) {
  if (result.data) {
    const plugins = new Set(result.data.items.map(i => i.plugin));
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
