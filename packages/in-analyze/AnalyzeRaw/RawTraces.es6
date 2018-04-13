import { compose } from 'recompose';
import React from 'react';

import { number, millis } from 'in-services/formatters/number';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  SortableTh,
  HorizontalIndicatorRow,
  LoadingSkeletonRows,
  ErrorRows,
  LoadMoreRow,
  Link
} from 'in-components/tables/sharedComponents';
import { analyze, getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import GroupingToggle from 'in-analyze/Analyze/GroupingToggle';
import getTraces from 'in-subscription/application/getTraces';
import { formatDateTime } from 'in-services/formatters/date';
import cursorPaginated from 'in-hoc/cursorPaginated';
import Card from 'in-new-components/Card';

const orderTranslation = {
  timestamp: 't',
  label: 'concat_dest_service_endpoint',
  duration: 'duration',
  errors: 'total_error_count'
};

const defaultOrder = orderTranslation['timestamp'];

export default compose(
  withUrlDependingState({
    getPathSegment: () => analyze,
    getMatrixPrefix: () => 'traces.',
    boundKeys: ['orderBy', 'orderDirection'],
    getInitialState: () => ({
      orderBy: defaultOrder,
      orderDirection: 'DESC'
    }),
    reducerName: 'onChangeOrder'
  }),
  cursorPaginated({
    getResettingProps: () => ['filter', 'orderBy', 'orderDirection'],
    get: ({ cursor, filter, orderBy, orderDirection }) =>
      getTraces({
        pagination: {
          cursor,
          retrievalSize: 50
        },
        order: {
          by: orderTranslation[orderBy] || defaultOrder,
          direction: orderDirection
        },
        filter
      })
  })
)(RawTraces);

function RawTraces({ items, errors, progress, loadMore, canLoadMore, orderBy, orderDirection, onChangeOrder }) {
  return (
    <Card title="Traces" header={<GroupingToggle raw />}>
      <Table>
        <Thead>
          <Tr>
            <RawTracesSortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="timestamp"
              label="Time"
            />
            <RawTracesSortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="ASC"
              technicalName="label"
              label="Label"
            />
            <RawTracesSortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="duration"
              label="Latency"
            />
            <RawTracesSortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="errors"
              label="Errors"
            />
          </Tr>
        </Thead>
        <Tbody>
          {items.map(item => (
            <Tr key={item.traceId}>
              <Td>
                <Link href$={getLinkToTraceDetail(item.traceId)}>{formatDateTime(item.startTime)}</Link>
              </Td>
              <Td>
                <Link href$={getLinkToTraceDetail(item.traceId)}>{item.label}</Link>
              </Td>
              <Td>{millis.fixedCompact(item.duration)}</Td>
              <Td>{number.compact(item.totalErrorCount)}</Td>
            </Tr>
          ))}

          <HorizontalIndicatorRow cols={4} progress={progress} />
          <ErrorRows cols={4} errors={errors} />
          {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={4} />}
          {canLoadMore && <LoadMoreRow loadMore={loadMore} cols={4} />}
        </Tbody>
      </Table>
    </Card>
  );
}

function RawTracesSortableColumn({ orderBy, orderDirection, defaultDirection, technicalName, label, onChangeOrder }) {
  return (
    <SortableTh
      isSortedByThisColumn={orderBy === technicalName}
      sortDirection={orderDirection}
      onClick={e => {
        e.preventDefault();
        e.stopPropagation();
        if (orderBy === technicalName) {
          onChangeOrder({
            orderBy: technicalName,
            orderDirection: orderDirection === 'ASC' ? 'DESC' : 'ASC'
          });
        } else {
          onChangeOrder({
            orderBy: technicalName,
            orderDirection: defaultDirection
          });
        }
      }}
    >
      {label}
    </SortableTh>
  );
}
