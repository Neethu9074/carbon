import React, { Fragment } from 'react';
import { compose } from 'recompose';

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  HorizontalIndicatorRow,
  LoadingSkeletonRows,
  ErrorRows,
  LoadMoreRow,
  Link
} from 'in-components/tables/sharedComponents';
import CallsAndGroupsIndicator from 'in-analyze/RawCalls/CallsAndGroupsIndicator';
import ErrorIndicator from 'in-analyze/TraceDetail/components/ErrorIndicator';
import { analyze, getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import SortableCallColumn from 'in-analyze/RawCalls/SortableCallColumn';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import withUrlDependingState from 'in-hoc/withUrlDependingState';
import { formatDateTime } from 'in-services/formatters/date';
import getCalls from 'in-subscription/application/getCalls';
import { millis } from 'in-services/formatters/number';
import cursorPaginated from 'in-hoc/cursorPaginated';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';

import locals from './RawCalls.mless';

const defaultOrder = 'timestamp';

export default compose(
  withUrlDependingState({
    getPathSegment: () => analyze,
    getMatrixPrefix: () => 'calls.',
    boundKeys: ['orderBy', 'orderDirection'],
    getInitialState: () => ({
      orderBy: defaultOrder,
      orderDirection: 'DESC'
    }),
    reducerName: 'onChangeOrder'
  }),
  cursorPaginated({
    getResettingProps: () => ['filters', 'orderBy', 'orderDirection'],
    get: ({ tagFiltersForSubscription, filterByGroup, cursor, filters, orderBy, orderDirection }) =>
      getCalls({
        pagination: {
          cursor,
          retrievalSize: 50
        },
        order: {
          by: orderBy || defaultOrder,
          direction: orderDirection
        },
        filter: {
          timeConfig: filters.get('timeConfig')
        },
        tagFilters: filterByGroup
          ? tagFiltersForSubscription.concat([
              { name: filterByGroup.name, operator: 'EQUALS', stringValue: filterByGroup.value }
            ])
          : tagFiltersForSubscription
      })
  })
)(RawCalls);

function RawCalls({
  items,
  totalHits,
  errors,
  progress,
  loadMore,
  canLoadMore,
  orderBy,
  orderDirection,
  onChangeOrder
}) {
  return (
    <Fragment>
      <CallsAndGroupsIndicator numCalls={totalHits} />
      <Table className={locals.table} tableInCard>
        <Thead>
          <Tr size="compact">
            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="ASC"
              technicalName="callName"
              label="Call"
            />

            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="ASC"
              technicalName="serviceName"
              label="Service"
            />

            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="timestamp"
              label="Timestamp"
            />

            <SortableCallColumn
              orderBy={orderBy}
              orderDirection={orderDirection}
              onChangeOrder={onChangeOrder}
              defaultDirection="DESC"
              technicalName="latency"
              label="Latency"
            />

            <SortableCallColumn
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
            <Tr key={item.call.id} size="compact">
              <Td>
                <div className={locals.cell}>
                  <SvgIcon className={locals.traceIcon} type="lib_application_trace" width={24} height={24} />
                  <Link href$={getLinkToTraceDetail(item.call.traceId, { callId: item.call.id })}>
                    {item.call.label}
                    {item.call.batchCount > 1 && (
                      <Tooltip
                        themeStyle="light"
                        content={`This call is batched and represents ${item.call.batchCount} individual calls.`}
                      >
                        <Pill className={locals.batchSizeIndicator} kind="lighter">
                          {item.call.batchCount}
                        </Pill>
                      </Tooltip>
                    )}
                  </Link>
                </div>
              </Td>

              <Td>
                <div className={locals.cell}>
                  <SvgIcon className={locals.serviceIcon} type="lib_application_service" width={24} height={24} />
                  <Link className={locals.serviceLink} href$={getServiceDashboard(item.call.service.id)}>
                    {item.call.service.label}
                  </Link>
                </div>
              </Td>

              <Td>
                <div className={locals.cell}>
                  <SvgIcon className={locals.timeIcon} type="lib_datetime_time" width={16} height={16} />
                  {formatDateTime(item.call.started)}
                </div>
              </Td>

              <Td>
                <span className={locals.metricValue}>{millis.fixedCompact(item.call.duration)}</span>
              </Td>

              <Td>
                <ErrorIndicator errorCount={item.call.errorCount} allowZero />
              </Td>
            </Tr>
          ))}

          <HorizontalIndicatorRow cols={6} progress={progress} />
          <ErrorRows cols={6} errors={errors} size="compact" />
          {items.length === 0 && progress.loading && <LoadingSkeletonRows cols={6} />}
          {canLoadMore && <LoadMoreRow loadMore={loadMore} size="compact" cols={6} />}
        </Tbody>
      </Table>
    </Fragment>
  );
}
