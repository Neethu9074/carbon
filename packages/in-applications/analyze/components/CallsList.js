import React from 'react';

import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import BatchingIndicator from 'in-analyze/components/BatchingIndicator';
import TableLinkWithIcon from 'in-analyze/components/TableLinkWithIcon';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { formatDateTime } from 'in-services/formatters/date';
import { latencyFixed } from 'in-services/formatters/number';
import { Link } from 'in-components/tables/sharedComponents';
import getCalls from 'in-subscription/application/getCalls';
import HealthDot from 'in-new-components/health/HealthDot';
import { callClickedTracker } from 'in-analyze/tracker';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import { empty } from 'reactive-observables';
import SvgIcon from 'in-components/SvgIcon';

import locals from './CallsList.mless';

const defaultOrder = 'timestamp';
const defaultDirection = 'DESC';

export default function CallsList({
  retrievalSize = 20,
  numSkeletonRows = 3,
  tagFilterExpression,
  filterBy,
  orderBy,
  onChangeOrderBy
}) {
  const timeConfig = useTimeConfig();
  const order = {
    by: orderBy.by || defaultOrder,
    direction: orderBy.direction || defaultDirection
  };
  const { items, ...tableProps } = useCursorPagination(
    ({ cursor }) =>
      getTableData({
        timeConfig,
        retrievalSize,
        tagFilterExpression,
        order,
        cursor
      }),
    [timeConfig, retrievalSize, tagFilterExpression, orderBy]
  );

  const columnDefinitions =
    useObservable(getColumnDefinitions({ timeConfig, tagFilterExpression, items }), [
      timeConfig,
      tagFilterExpression,
      items
    ]) || staticColumnDefinitions;

  const optionalColumns = () => columnDefinitions.filter(columnDefinition => columnDefinition.optional);

  return (
    <div className={locals.wrapper}>
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
    width: '4'
  },
  {
    id: 'call_icon',
    label: '',
    sortable: false,
    getContent() {
      return <SvgIcon type="lib_application_call" />;
    },
    width: '4'
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
        <TableLinkWithIcon href$={getServiceDashboard(item.call.service.id)} icon="lib_application_service">
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
    width: '12'
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
    width: '8'
  }
];

function getColumnDefinitions() {
  // Here is where a dynamic list of columns would go
  // Do not forget to concat staticColumnDefinitions
  return empty;
}
