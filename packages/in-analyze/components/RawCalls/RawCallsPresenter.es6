import React, { Fragment } from 'react';

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
import ItemsInGroupsIndicator from 'in-analyze/components/ItemsInGroupsIndicator';
import AnalyzeCallsWorkspace from 'in-analyze/components/AnalyzeCallsWorkspace';
import ErrorIndicator from 'in-analyze/TraceDetail/components/ErrorIndicator';
import SortableCallColumn from 'in-analyze/components/SortableCallColumn';
import { getServiceDashboard } from 'in-applications/navigation/paths';
import { getLinkToTraceDetail } from 'in-analyze/navigation/paths';
import { formatDateTime } from 'in-services/formatters/date';
import { millis } from 'in-services/formatters/number';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';

import locals from './RawCallsPresenter.mless';

export default function RawCalls(props) {
  const { items, totalHits, errors, progress, loadMore, canLoadMore, orderBy, orderDirection, onChangeOrder } = props;
  return (
    <AnalyzeCallsWorkspace {...props}>
      <ItemsInGroupsIndicator numCalls={totalHits} />
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
              technicalName="serviceLabel"
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
                      <Fragment>
                        {' '}
                        <Tooltip
                          themeStyle="light"
                          content={`This call is batched and represents ${item.call.batchCount} individual calls.`}
                        >
                          <Pill className={locals.batchSizeIndicator} kind="lighter">
                            {item.call.batchCount}
                          </Pill>
                        </Tooltip>
                      </Fragment>
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
    </AnalyzeCallsWorkspace>
  );
}
