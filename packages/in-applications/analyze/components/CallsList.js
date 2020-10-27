import React from 'react';

import FacetedSearch from 'in-applications/analyze/components/FacetedSearch/FacetedSearch';
import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import BatchingIndicator from 'in-analyze/components/BatchingIndicator';
import TableLinkWithIcon from 'in-analyze/components/TableLinkWithIcon';
import InlineTabNavigation from 'in-new-components/InlineTabNavigation';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { number, latencyFixed } from 'in-services/formatters/number';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { formatDateTime } from 'in-services/formatters/date';
import { Link } from 'in-components/tables/sharedComponents';
import getCalls from 'in-subscription/application/getCalls';
import HealthDot from 'in-new-components/health/HealthDot';
import { callClickedTracker } from 'in-analyze/tracker';
import useTimeConfig from 'in-hooks/useTimeConfig';
import { empty } from 'reactive-observables';
import SvgIcon from 'in-components/SvgIcon';

import locals from './List.mless';

const defaultOrder = 'timestamp';
const defaultDirection = 'DESC';

export default function CallsList({
  retrievalSize = 20,
  numSkeletonRows = 3,
  tagFilterExpression,
  filterBy,
  orderBy,
  onChangeOrderBy,
  isValid,
  addFilter,
  removeFilter,
  tableOnly = false
}) {
  const timeConfig = useTimeConfig();
  const order = {
    by: orderBy.by || defaultOrder,
    direction: orderBy.direction || defaultDirection
  };
  const { items, ...tableProps } = useCursorPagination(
    ({ cursor }) =>
      isValid
        ? getTableData({
            timeConfig,
            retrievalSize,
            tagFilterExpression,
            order,
            cursor
          })
        : empty,
    [timeConfig, retrievalSize, tagFilterExpression, orderBy, isValid]
  );

  const columnDefinitions = staticColumnDefinitions;

  const optionalColumns = () => columnDefinitions.filter(columnDefinition => columnDefinition.optional);

  return tableOnly ? (
    <TableOnlyPresenter
      items={items}
      columnDefinitions={columnDefinitions}
      optionalColumns={optionalColumns}
      numSkeletonRows={numSkeletonRows}
      onChangeOrderBy={onChangeOrderBy}
      tableProps={tableProps}
      order={order}
      retrievalSize={retrievalSize}
      filterBy={filterBy}
    />
  ) : (
    <Presenter
      items={items}
      tagFilterExpression={tagFilterExpression}
      addFilter={addFilter}
      removeFilter={removeFilter}
      columnDefinitions={columnDefinitions}
      optionalColumns={optionalColumns}
      numSkeletonRows={numSkeletonRows}
      onChangeOrderBy={onChangeOrderBy}
      tableProps={tableProps}
      order={order}
      retrievalSize={retrievalSize}
      filterBy={filterBy}
    />
  );
}

function Presenter({
  items,
  tagFilterExpression,
  addFilter,
  removeFilter,
  columnDefinitions,
  optionalColumns,
  numSkeletonRows,
  onChangeOrderBy,
  tableProps,
  order,
  retrievalSize,
  filterBy
}) {
  const totalCalls = tableProps?.totalHits != null ? `${number.compact(tableProps.totalHits)} Calls` : null;
  return (
    <div className={locals.wrapper}>
      <div className={locals.hitsAndFacetedSearch}>
        <InlineTabNavigation tabList={[{ text: totalCalls }]} />
        <FacetedSearch tagFilterExpression={tagFilterExpression} addFilter={addFilter} removeFilter={removeFilter} />
      </div>
      <div className={locals.table}>
        <CursorPaginatedTable
          columnDefinitions={columnDefinitions}
          optionalColumns={optionalColumns}
          numSkeletonRows={numSkeletonRows}
          onChange={onChangeOrderBy}
          {...tableProps}
          items={items}
          fixedLayout
          orderBy={order.by}
          orderDirection={order.direction}
          loadMoreLabel={`Load ${retrievalSize} more`}
          filterBy={filterBy}
        />
      </div>
    </div>
  );
}

function TableOnlyPresenter({
  items,
  columnDefinitions,
  optionalColumns,
  numSkeletonRows,
  onChangeOrderBy,
  tableProps,
  order,
  retrievalSize,
  filterBy
}) {
  return (
    <div className={locals.table}>
      <CursorPaginatedTable
        columnDefinitions={columnDefinitions}
        optionalColumns={optionalColumns}
        numSkeletonRows={numSkeletonRows}
        onChange={onChangeOrderBy}
        {...tableProps}
        items={items}
        fixedLayout
        orderBy={order.by}
        orderDirection={order.direction}
        loadMoreLabel={`Load ${retrievalSize} more`}
        filterBy={filterBy}
      />
    </div>
  );
}

function getTableData({ timeConfig, retrievalSize, tagFilterExpression, order, previewEnabled = false, cursor }) {
  return getCalls({
    pagination: {
      cursor,
      retrievalSize
    },
    order,
    filter: {
      timeConfig: timeConfig
    },
    tagFilterExpression,
    queryPrecision: previewEnabled ? 'APPROXIMATE' : 'FULL'
  });
}

const staticColumnDefinitions = [
  {
    id: 'erroneous',
    label: (
      <div
        style={{
          width: 10,
          height: 10
        }}
        className={locals.dot}
      />
    ),
    sortable: false,
    getContent(item) {
      const severity = item.call.errorCount;
      return (
        <div className={locals.erroneous}>
          <HealthDot severity={severity} iconSize={10} />
        </div>
      );
    },
    widthInAbsoluteUnit: true,
    width: '3rem'
  },
  {
    id: 'call_icon',
    label: '',
    sortable: false,
    getContent() {
      return <SvgIcon type="lib_application_call" />;
    },
    widthInAbsoluteUnit: true,
    width: '3rem'
  },
  {
    id: 'call',
    label: 'Call',
    sortable: false,
    getContent(item) {
      return (
        <Link
          href$={getLinkToTraceDetail(item.call.traceId, {
            callId: item.call.id
          })}
          onClick={() => callClickedTracker()}
        >
          {item.call.label}
          <BatchingIndicator
            batchCount={item.call.batchCount}
            tooltipContent={`This call is batched and represents ${item.call.batchCount} individual calls.`}
          />
        </Link>
      );
    }
  },
  {
    id: 'service',
    label: 'Service',
    sortable: false,
    getContent(item) {
      return (
        <TableLinkWithIcon href$={getServiceDashboard(item.call.service.id)}>
          {item.call.service.label}
        </TableLinkWithIcon>
      );
    },
    width: '25'
  },
  {
    id: 'timestamp',
    label: 'Timestamp',
    getContent(item) {
      return formatDateTime(item.call.started);
    },
    widthInAbsoluteUnit: true,
    width: '11rem'
  },
  {
    id: 'latency',
    label: 'Latency',
    getContent(item) {
      return (
        <>
          {latencyFixed.compact(item.call.duration)}
          <BatchingIndicator
            batchCount={item.call.batchCount}
            tooltipContent={`Total latency of ${item.call.batchCount} batched calls.`}
          />
        </>
      );
    },
    widthInAbsoluteUnit: true,
    width: '7rem'
  }
];
