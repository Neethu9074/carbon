import { compose } from 'recompose';
import React from 'react';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  SortableTh,
  HorizontalIndicatorRow,
  LoadingSkeletonRows,
  ErrorRows,
  LoadMoreRow,
  Link
} from 'in-components/tables/sharedComponents';
import ErrorIndicator from 'in-analyze/TraceDetail/components/ErrorIndicator';
import { analyze, getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { number, millis } from 'in-services/formatters/number';
import GroupingToggle from 'in-analyze/shared/GroupingToggle';
import getTraces from 'in-subscription/application/getTraces';
import { formatDateTime } from 'in-services/formatters/date';
import cursorPaginated from 'in-hoc/cursorPaginated';
import SvgIcon from 'in-components/SvgIcon';
import Card from 'in-new-components/Card';

import locals from './RawTracesPage.mless';

const orderTranslation = {
  timestamp: 't',
  label: 'concat_dest_service_endpoint',
  callCount: 'number_of_calls',
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
)(RawTracesPage);

function RawTracesPage({ items, errors, progress, loadMore, canLoadMore, orderBy, orderDirection, onChangeOrder }) {
  let label = 'Traces';
  if (items && items.length > 0) {
    label += ` (${items.length})`;
  }

  return (
    <Card title={label} header={<GroupingToggle raw />} withoutPadding>
      <Table tableInCard>
        <Thead>
          <Tr size="compact">
            <RawTracesSortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="ASC"
              technicalName="label"
              label="Trace Name"
            />
            <RawTracesSortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="timestamp"
              label="Started"
            />
            <Th>Started At</Th>
            <RawTracesSortableColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="callCount"
              label="Service Calls"
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
            <Tr key={item.traceId} size="compact">
              <Td>
                <div className={locals.cell}>
                  <SvgIcon className={locals.traceIcon} type="lib_application_trace" width={24} height={24} />
                  <Link href$={getLinkToTraceDetail(item.traceId)}>{item.label}</Link>
                </div>
              </Td>
              <Td>
                <div className={locals.cell}>
                  <SvgIcon className={locals.timeIcon} type="lib_datetime_time" width={16} height={16} />
                  {formatDateTime(item.startTime)}
                </div>
              </Td>
              <Td>
                <div className={locals.cell}>
                  <SvgIcon className={locals.serviceIcon} type="lib_application_service" width={24} height={24} />
                  <Link className={locals.serviceLink} href$={getServiceDashboard(item.service.id)}>
                    {item.service.label}
                  </Link>
                </div>
              </Td>
              <Td>
                <span className={locals.metricValue}>{number.compact(item.callCount)}</span>
              </Td>
              <Td>
                <span className={locals.metricValue}>{millis.fixedCompact(item.duration)}</span>
              </Td>
              <Td>
                <ErrorIndicator errorCount={item.totalErrorCount} />
              </Td>
            </Tr>
          ))}

          <HorizontalIndicatorRow cols={6} progress={progress} />
          <ErrorRows cols={6} errors={errors} size="compact" />
          {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={6} />}
        </Tbody>
      </Table>
      {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" />}
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
