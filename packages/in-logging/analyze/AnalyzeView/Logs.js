import React from 'react';

import CursorPaginatedTable from 'in-components/tables/ServerTable/CursorPaginatedTable';
import useCursorPagination from 'in-hooks/useCursorPagination';
import { formatDateTime } from 'in-services/formatters/date';
import getLogs from 'in-logging/subscriptions/getLogs';

const defaultOrder = 'timestamp';
const defaultDirection = 'DESC';

const columnDefinitions = [
  {
    id: 'timestamp',
    label: 'Time',
    sortable: false,
    getContent(item) {
      return formatDateTime(item.log.timestamp);
    },
    widthInAbsoluteUnit: true,
    width: '3rem'
  },
  {
    id: 'content',
    label: 'Content',
    sortable: false,
    getContent(item) {
      return item.log.rawContent;
    },
    widthInAbsoluteUnit: true,
    width: '3rem'
  }
];

export default function Logs({ orderBy, timeConfig, onChangeOrderBy, retrievalSize = 10, tagFilterExpression }) {
  const order = {
    by: orderBy ? orderBy.by : defaultOrder,
    direction: orderBy ? orderBy.direction : defaultDirection
  };

  const { items, totalHits, ...tableProps } = useCursorPagination(
    ({ cursor }) => getTableData({ timeConfig, retrievalSize, tagFilterExpression, order, cursor }),
    [timeConfig, retrievalSize, order.by, order.direction]
  );

  return (
    <CursorPaginatedTable
      columnDefinitions={columnDefinitions}
      numSkeletonRows={3}
      totalHits={totalHits}
      onChange={({ orderBy, orderDirection }) => onChangeOrderBy({ by: orderBy, direction: orderDirection })}
      {...tableProps}
      items={items}
      fixedLayout
      orderBy={order.by}
      orderDirection={order.direction}
    />
  );
}

function getTableData({ timeConfig, retrievalSize, tagFilterExpression, order, cursor }) {
  return getLogs({
    pagination: {
      cursor,
      retrievalSize
    },
    order,
    timeConfig: timeConfig,
    tagFilterExpression
  });
}
